/// <reference path="../typings/es6-promise/es6-promise.d.ts"/>
/// <reference path="../typings/big.js/big.js.d.ts"/>
import { Promise } from "es6-promise";
import Big = require("big.js");

/**
 * Defines the JSON signature for cycle length calculations. This is used by
 * both the repeat and sequence cycles.
 *
 * @interface
 */
export interface CalendarLengthData {
    /**
     * The amount to adjust a *cycle index* when this length is applied. This
     * must be a whole number (1 or higher integer).
     */
    count: number;

    /**
     * The amount to modify the Julian Day Number when this length is valid for
     * a cycle calculation. Typically `julian` or `single` is required to
     * calculate the length of a cycle.
     */
    julian?: number;

    /**
     * A series of length elements that have various calculations. Only one
     * length within the single is selected, the first one that is valid for
     * the current state.
     */
    single?: Array<CalendarLengthData>;

    /**
     * The reference to a calculated cycle id. This is used with the operation
     * and value properties to determine if this length is valid for the current
     * state. Only cycles that were already calculated, such as parent cycles
     * and ones earlier in the sequence, can be referenced.
     *
     * This is only required with conditional lengths.
     */
    ref?: string;

    /**
     * The operation used to determine if a length is valid. This is used with
     * ref and value. The only values can be "div" and "mod".
     *
     * This is only required with conditional lengths.
     */
    operation?: string;

    /**
     * The value used for the operations and ref properties. The value is
     * determined by the operation, which requires an integer value.
     *
     * This is only required with conditional lengths.
     */
    value?: number;
}

/**
 * Defines the JSON data for a calendar cycle.
 *
 * @interface
 */
export interface CalendarCycleData {
    /**
     * The identifier for the cycle. This must be unique not only within a
     * single calendar but also all other combined calendars used by a given
     * culture.
     */
    id: string;
    type: string;
    cycles: Array<CalendarCycleData>;
    lengths?: Array<CalendarLengthData>;
    ref?: string;
    value?: number;
    operation?: string;
    offset?: number;
    partialDaysOnly?: boolean;
}

/**
 * Base class for all top-level culture components.
 */
export interface ComponentData {
    id: string;
    version: number;
    type: string;
}

export interface CultureTemporalFormatElementData {
    ref?: string;
    constant?: string;
    default?: any;
    minDigits?: number;
    maxDigits?: number;
    offset?: number;
    prefix?: string;
    suffix?: string;
    lookup?: boolean;
    maxValue?: number;
    minValue?: number;
    parseRef?: string;
}
export interface CultureTemporalData {
    calendars: Array<string>;
    instantFormats: { [id: string]: Array<CultureTemporalFormatElementData> };
}
/**
 * The metadata and top-level information for calendar
 */
export interface CalendarData extends ComponentData {
    cycles?: Array<CalendarCycleData>;
}

export interface CultureData extends ComponentData {
    temporal?: CultureTemporalData;
    lookups: { [id: string]: string };
}
export interface CultureDataProvider {
    getCalendarData(id: string): Promise<CalendarData>;
    getCultureData(id: string): Promise<CultureData>;
}

export class Calendar {
    constructor(data: CalendarData) {
        this.data = data;
        this._bigCache = {};
    }

    public data: CalendarData;
    private _bigCache: { [key: string]: BigJsLibrary.BigJS };

    public getInstant(input: number|string|BigJsLibrary.BigJS): any {
        // Normalize the Julian date to milliseconds because it is easier to
        // handle base-12 and base-3 elements from there.
        var julian = toBig(input);

        // Set up the default instant. We use the toJulianDate instead of the
        // input directly to ensure we are converting exactly what we intend.
        var instant = { julian: Number(julian) };

        // Go through each of the cycles and calculate each one. We will reset
        // the julian date for each one since each of these cycles is calculated
        // independently.
        for (var cycle of this.data.cycles) {
            this.calculateCycle(cycle, julian, instant);
        }

        // Return the resulting calendar instant.
        return instant;
    }

    public getJulian(instant: any): number {
        var bigJulian = this.getBigJulian(instant);
        return Number(bigJulian);
    }

    public getBigJulian(instant: any): BigJsLibrary.BigJS {
        // Loop through the top-level cycles and see if any of these will work.
        // If they do, calculate the Julian Date. At the moment, we include all
        // of the root elements which will handle composite calendars.
        var julian = Big(0);
        var working = {};

        for (var cycle of this.data.cycles) {
            var cycleJulian = this.getCycleJulian(instant, cycle, working);
            julian = julian.plus(cycleJulian);
        }

        // Return the resulting julian.
        return julian;
    }

    private getCycleJulian(instant: any, cycle: CalendarCycleData, working: any): BigJsLibrary.BigJS {
        // If we don't have the index for the cycle, then skip it.
        var julian = Big(0);

        if (!(cycle.id in instant)) {
            return julian;
        }

        // Figure out the type of cycle, since that will determine how we
        // calcualte it.
        var index = instant[cycle.id];

        switch (cycle.type) {
            case "repeat":
                julian = this.getRepeatCycleJulian(instant, cycle, working);
                break;
            case "sequence":
                julian = this.getSequenceCycleJulian(instant, cycle, working);
                break;
            default: throw new Error("Cannot process unknown cycle type: " + cycle.type + ".");
        }

        // Once we go through this, then go through the child cycles.
        if (cycle.cycles) {
            for (var child of cycle.cycles) {
                var childJulian = this.getCycleJulian(instant, child, working);
                julian = julian.plus(childJulian);
            }
        }

        // If we have an offset, modify it.
        if (cycle.offset) {
            julian = julian.minus(this.getCachedBig(cycle.id + "_offset", cycle.offset));
        }

        // Pull out the index and calculate the values.
        return julian;
    }

    private getRepeatCycleJulian(instant: any, cycle: CalendarCycleData, working: any): BigJsLibrary.BigJS {
        // Start with the base cycle and zero out the index of the working set.
        var index = instant[cycle.id];
        var julian = Big(0);
        working[cycle.id] = 0;

        // Loop through the types, processing each one until we run out.
        while (working[cycle.id] <= index) {
            // Calculate the length of the next cycle by finding the next one.
            var found = false;

            for (var lengthIndex in cycle.lengths) {
                // If this cycle would have put us over, skip it.
                var length = cycle.lengths[lengthIndex];
                if (length.count + working[cycle.id] > index) { continue; }

                // Calculate the length of this length. If this is less than or
                // equal to the Julian Date, we need to keep it.
                var next = this.calculateLength(
                    cycle.id + "/" + lengthIndex,
                    length,
                    working);

                if (next.lte(0)) { continue; }

                working[cycle.id] += length.count;
                julian = julian.plus(next);
                found = true;
                break;
            }

            // If we fall through, then there is something wrong so break out.
            if (!found) { break; }
        }

        // Return the resulting Julian date.
        return julian;
    }

    private getSequenceCycleJulian(instant: any, cycle: CalendarCycleData, working: any): BigJsLibrary.BigJS {
        // Start with the base cycle and zero out the index of the working set.
        var index = instant[cycle.id];
        var julian = Big(0);
        working[cycle.id] = 0;

        // Loop through the sequence lengths until we exceed our limit.
        for (var cycleIndex = 0; cycleIndex < index; cycleIndex++) {
            // Update the working with the current cycle.
            working[cycle.id] = cycleIndex;

            // Calculate the length of this sequence.
            var length = cycle.lengths[cycleIndex];
            var next = this.calculateLength(
                cycle.id + "/" + cycleIndex,
                length,
                instant);

            julian = julian.plus(next);
        }

        // Return the resulting Julian date.
        return julian;
    }

    private calculateCycle(cycle: CalendarCycleData, julian: BigJsLibrary.BigJS, instant: any): void {
        // If we have an offset, modify the date by it.
        if (cycle.offset) {
            julian = julian.plus(this.getCachedBig(cycle.id + "_offset", cycle.offset));
        }

        // Check to see if we are only dealing with days.
        if (cycle.partialDaysOnly) {
            julian = getPartialDays(julian);
        }

        // Figure out what to do based on the type of the cycle.
        switch (cycle.type) {
            case "repeat":
                this.calculateRepeatCycle(cycle, julian, instant);
                break;

            case "calculate":
                this.calculateCalculateCycle(cycle, julian, instant);
                break;

            case "sequence":
                this.calculateSequenceCycle(cycle, julian, instant);
                break;

            default: throw "Cannot handle cycle type of " + cycle.type + ".";
        }
    }

    private calculateCalculateCycle(cycle: CalendarCycleData, julian: BigJsLibrary.BigJS, instant: any): void {
        var ref = cycle.ref;
        var index = instant[ref];
        var value = cycle.value;

        switch (cycle.operation) {
            case "mod": instant[cycle.id] = index % value; break;
            case "div": instant[cycle.id] = Math.floor(index / value); break;
        }

        // If we have additional cycles, we want to calculate them recursively.
        if (cycle.cycles) {
            for (var child of cycle.cycles) {
                this.calculateCycle(child, julian, instant);
            }
        }
    }

    private calculateRepeatCycle(cycle: CalendarCycleData, julian: BigJsLibrary.BigJS, instant: any): void {
        // Start with the zero index.
        instant[cycle.id] = 0;

        // Loop through the various lengths until we encounter a length that
        // exceeds the remaining Julian Date.
        while (julian.gt(0)) {
            // Calculate the length of the next cycle by finding the next one.
            var found = false;

            for (var lengthIndex in cycle.lengths) {
                // Calculate the length of this length. If this is less than or
                // equal to the Julian Date, we need to keep it.
                var length = cycle.lengths[lengthIndex];
                var next = this.calculateLength(
                    cycle.id + "/" + lengthIndex,
                    length,
                    instant);

                if (next.lte(0)) { continue; }

                if (next.lte(julian)) {
                    instant[cycle.id] += length.count;
                    julian = julian.minus(next);
                    found = true;
                    break;
                }
            }

            // If we fall through, then there is something wrong so break out.
            if (!found) { break; }
        }

        // If we have additional cycles, we want to calculate them recursively.
        if (cycle.cycles) {
            for (var child of cycle.cycles) {
                this.calculateCycle(child, julian, instant);
            }
        }
    }

    private calculateSequenceCycle(cycle: CalendarCycleData, julian: BigJsLibrary.BigJS, instant: any): void {
        // Start with the zero index.
        instant[cycle.id] = 0;

        //console.log("seq", cycle.id, "begin", julianDate);

        // Loop through the sequences until we exceed our limit.
        var found = false;

        for (var lengthIndex in cycle.lengths) {
            // Calculate the length of this length. If this is less than or
            // equal to the Julian Date, we need to keep it and move to the next.
            var length = cycle.lengths[lengthIndex];
            var next = this.calculateLength(
                cycle.id + "/" + lengthIndex,
                length,
                instant);

            //console.log("seq", cycle.id, "next", julianDate, next);
            if (next.lte(0) || next.gt(julian)) { break; }

            // Adjust the instant cycle index and move to the next.
            instant[cycle.id]++;
            julian = julian.minus(next);

            // If we hit zero, we're done.
            if (julian.lte(0)) { break; }
        }

        //console.log("seq", cycle.id, "end", julianDate, instant[cycle.id]);

        // If we have additional cycles, we want to calculate them recursively.
        if (cycle.cycles) {
            for (var child of cycle.cycles) {
                this.calculateCycle(child, julian, instant);
            }
        }
    }

    private calculateLength(cacheKey: string, length: CalendarLengthData, instant: any): BigJsLibrary.BigJS {
        // See if we have "single", which means a choice between multiple
        // lengths.
        if (length.single) {
            // Loop through the single lengths until we find one that is
            // applicable.
            //console.log("single", "begin");
            for (var single of length.single) {
                var singleRef = single.ref;
                var singleIndex = instant[singleRef];
                var singleValue = single.value;

                //console.log("single", "obj", single);
                //console.log("single", "ref", singleRef, singleValue);

                switch (single.operation) {
                    case "mod":
                        if (singleIndex % singleValue != 0) { continue; }
                        break;

                    case "div":
                        if (Math.floor(singleIndex / singleValue) != 0) { continue; }
                        break;
                }

                //console.log("single", "found", singleRef, singleValue);
                return this.getCachedBig(cacheKey, single.julian);
            }
        }

        // If we have an operation, then we need to calculate this. If the
        // operation doesn't match, then return 0 to skip the cycle.
        if (length.operation) {
            var ref = length.ref;
            var index = instant[ref];
            var value = length.value;

            switch (length.operation) {
                case "mod":
                    if (index % value != 0) { return Big(0); }
                    break;

                case "div":
                    if (Math.floor(index / value) != 0) { return Big(0); }
                    break;
            }
        }

        // We have a valid value, so return the results.
        return this.getCachedBig(cacheKey, length.julian);
    }

    private getCachedBig(key: string, input: number|string|BigJsLibrary.BigJS): BigJsLibrary.BigJS {
        // See if we already have the value in the key. We cache the results
        // since calendar data is not dynamic and these are typically relatively
        // small in quantity but used heavily.
        if (key in this._bigCache) {
            return this._bigCache[key];
        }

        // Calculate the value, cache it, and return the results.
        var results = toBig(input);
        this._bigCache[key] = results;
        return results;
    }
}

export class Culture {
    constructor(data: CultureData) {
        if (!data) { throw new Error("Cannot create a culture without "); }
        this._data = data;
    }

    private _data: CultureData;
    public calendar: Calendar;

    public getTemporalFormats(): Array<string> {
        var formats = new Array<string>();

        if (this._data.temporal) {
            var formatData = this._data.temporal.instantFormats;

            for (var format in formatData) {
                formats.push(format);
            }
        }

        return formats;
    }

    public formatInstant(instant: any, formatId: string): string {
        // First make sure this is a known format for this culture.
        var elements = this._data.temporal.instantFormats[formatId];
        if (!elements) { throw new Error("Unknown format ID: " + formatId + "."); }

        // We have the format, so build up a string that contents the elements.
        var buffer = "";

        for (var elem of elements) {
            // If we are a constant, we can just add it.
            if (elem.constant) {
                buffer += elem.constant;
                continue;
            }

            // If we have a reference, then format the cycle.
            if (elem.ref) {
                // Get the cycle index.
                var cycleIndex = instant[elem.ref];

                if (cycleIndex === undefined) {
                    throw new Error("Cannot find cycle " + elem.ref + " in " + instant + ".");
                }

                // Add the formatted value to the buffer.
                var value: string = this.formatIndex(elem, cycleIndex);
                buffer += value;
            }
        }

        // Return the resulting text.
        return buffer;
    }

    public parseInstant(input: string, formatId?: string): any {
        // If the format ID is given, we retrieve that and determine if we were
        // given a valid input.
        if (formatId) {
            if (!(formatId in this._data.temporal.instantFormats)) {
                throw new Error("Unknown temporal format: " + formatId + ".");
            }
        } else {
            // We have to search for the format. We do this by cycling through
            // until we find a regex that matches.
            var found = false;

            for (var fmtId in this._data.temporal.instantFormats) {
                var fmt = this._data.temporal.instantFormats[fmtId];
                var fmtRegex = this.getRegex(fmt);

                if (fmtRegex.test(input)) {
                    formatId = fmtId;
                    found = true;
                    break;
                }
            }

            // If we didn't find it, see if this could be a JDN.
            if (!found && this.isNumeric(input)) {
                var simpleJulian = Big(input);
                var populatedInstant = this.calendar.getInstant(simpleJulian);
                return populatedInstant;
            }

            // If we didn't find it, we have a problem.
            if (!found) {
                throw new Error("Cannot infer format from " + input + ".");
            }
        }

        // Grab the format and see if this matches the input.
        var formatElements = this._data.temporal.instantFormats[formatId];
        var regex = this.getRegex(formatElements);
        var isMatch = regex.test(input);

        if (!isMatch) {
            throw new Error("Cannot find a match for parsing the input: " + input + ".");
        }

        // Go through the elements and pull out each one.
        var matches = input.match(regex);
        var matchIndex = 1;
        var instant: any = {};

        for (var elem of formatElements) {
            // If we have a constant, then skip it.
            if (elem.constant) { continue; }

            // If we have a default, then set the cycles.
            if (elem.default) {
                for (var key in elem.default) {
                    instant[key] = elem.default[key];
                }
            }

            // Pull out the elements and reverse the value.
            var ref = elem.parseRef ? elem.parseRef : elem.ref;

            if (ref) {
                // Get the value and then add it to any existing value.
                var value = matches[matchIndex++];
                var cycleIndex = this.getCycleIndex(elem, value);
                if (!(ref in instant)) { instant[ref] = 0; }
                instant[ref] += cycleIndex;
            }
        }

        // This is a partial instant, so convert it to Julian and then back into
        // a fully populated object.
        var julian = this.calendar.getBigJulian(instant);
        var populatedInstant = this.calendar.getInstant(julian);
        return populatedInstant;
    }

    private isNumeric(input: string) {
        var n = parseFloat(input);
        return !isNaN(n) && isFinite(n);
    }

    private getCycleIndex(elem: CultureTemporalFormatElementData, value: string): number {
        // If we have a lookup, then figure out the code.
        if (elem.lookup) {
            // Loop through all possible values.
            for (var i = 0; i < elem.maxValue; i++) {
                var keyValue = this.formatIndex(elem, i);

                if (keyValue.toLowerCase() == value.toLowerCase()) {
                    return i;
                }
            }

            // If we got this far, we couldn't parse it.
            throw new Error("Cannot parse the string value " + value + " for " + elem.ref + ".");
        }

        // Remove the leading zeros and convert it to a number.
        value = value.replace(/^0+/, "");
        var index = parseInt(value, 10);

        // If set have an offset, reverse it.
        if (elem.offset) { index -= elem.offset; }

        // Return the resulting index.
        return index;
    }

    private getRegex(elements: Array<CultureTemporalFormatElementData>): RegExp {
        // Build up a regular expression from the elements.
        var buffer = "";

        for (var element of elements) {
            // If we have a constant, then just add it directly to the regex.
            if (element.constant) {
                buffer += element.constant
                    .replace("\\", "\\\\")
                    .replace("/", "\\/")
                    .replace(".", "\\.");
                continue;
            }

            // If we have a maxValue, then put a simple list.
            if (element.lookup) {
                // Make sure we have a maxValue.
                if (!element.maxValue) {
                    throw new Error("Cannot parse a lookup element without maxValue.");
                }

                // Go through the parts and build everything together.
                var lookups = new Array<string>();

                for (var i = 0; i <= element.maxValue; i++) {
                    var value: string = this
                        .formatIndex(element, i)
                        .replace("\\", "\\\\")
                        .replace("/", "\\/")
                        .replace(".", "\\.");
                    lookups.push(value);
                }

                // Add the regular expression.
                buffer += "(" + lookups.join("|") + ")";
                continue;
            }

            // If we don't have a lookup, then go with the numeric values.
            if (!element.maxDigits) {
                throw new Error("Cannot parse a value for " + element.ref + " without a maxDigits.");
            }

            if (!element.minDigits) {
                throw new Error("Cannot parse a value for " + element.ref + " without a minDigits.");
            }

            // Create a regex for the numeric value.
            if (element.minDigits === element.maxDigits) {
                buffer += "(\\d{" + element.minDigits + "})";
            } else {
                buffer += "(\\d{" + element.minDigits + "," + element.maxDigits + "})";
            }
        }

        // Return the resulting buffer.
        buffer = "^" + buffer + "$";
        return new RegExp(buffer, "i");
    }

    private formatIndex(elem: CultureTemporalFormatElementData, cycleIndex: number): string {
        // Handle any offset, if we have one.
        if (elem.offset) { cycleIndex += elem.offset; }

        // Convert the results to a string.
        var value = cycleIndex.toString();
        // Get the zero-padding.
        if (elem.minDigits) {
            while (value.length < elem.minDigits) {
                value = "0" + value;
            }
        }

        // If we have a prefix or suffix, add them.
        if (elem.prefix) { value = elem.prefix + value; }
        if (elem.suffix) { value = elem.suffix + value; }


        // If we have a lookup code, then use the resulting value as
        // a lookup.
        if (elem.lookup) {
            value = this._data.lookups[value];
        }

        // Return the resulting value.
        return value;
    }
}

export class CultureProvider {
    constructor(dataProvider: CultureDataProvider) {
        if (!dataProvider) {
            throw new Error("Cannot create a CultureProvider without a data provider.");
        }

        this._dataProvider = dataProvider;
    }

    private _dataProvider: CultureDataProvider;

    public getCalendarPromise(id: string): Promise<Calendar> {
        var that = this;
        return new Promise<Calendar>(
            function(resolve, error) {
                var dataPromise = that._dataProvider.getCalendarData(id);

                dataPromise.then(
                    function(data) {
                        resolve(new Calendar(data));
                    },
                    function(dataError) {
                        error(dataError);
                    });
            });
    }

    public getCulturePromise(id: string): Promise<Culture> {
        var that = this;
        return new Promise<Culture>(
            function(resolve, error) {
                var dataPromise = that._dataProvider.getCultureData(id);

                dataPromise.then(
                    function(data) {
                        // Create the base culture from the
                        var culture = new Culture(data);

                        // We need to load all the calendars for this culture.
                        // Since these are loaded via promises, we need to
                        // resolve all of them.
                        var calendarPromises = Array<Promise<Calendar>>();

                        if (data.temporal && data.temporal.calendars) {
                            for (var calendarId of data.temporal.calendars) {
                                var calendarPromise = that.getCalendarPromise(calendarId);
                                calendarPromises.push(calendarPromise);
                            }
                        }

                        var allCalendarPromises = Promise.all(calendarPromises);

                        allCalendarPromises.then(
                            function(promises) {
                                // If we have no promises, nothing to worry about.
                                if (promises.length == 1) {
                                    // If we have a single calendar, just use it.
                                    culture.calendar = promises[0];
                                }
                                else if (promises.length > 1) {
                                    // If we have multiple, then combine everything
                                    // into a single one and then add that.
                                    culture.calendar = that.combineCalendars(promises);
                                }

                                // Resolve the culture.
                                resolve(culture);
                            });
                    },
                    function(dataError) {
                        error(dataError);
                    });
            });
    }

    private combineCalendars(calendars: Array<Calendar>): Calendar {
        // Use the first calendar and combine the results into it.
        var calendar = calendars[0];
        calendar.data.id = "composite";

        for (var index = 1; index < calendars.length; index++) {
            var childCalendar = calendars[index];

            if (childCalendar.data.cycles) {
                for (var cycle of childCalendar.data.cycles) {
                    calendar.data.cycles.push(cycle);
                }
            }
        }

        // Return the resulting calendar.
        return calendar;
    }
}

export class ArrayCultureDataProvider implements CultureDataProvider {
    constructor(components: Array<ComponentData>) {
        this.components = components;
    }

    private components: Array<ComponentData>;

    public getCalendarData(id: string): Promise<CalendarData> {
        var that = this;
        return new Promise<CalendarData>(function(resolve, error) {
            var calendarData: CalendarData = that.getComponent(id);
            resolve(calendarData);
        });
    }

    public getCultureData(id: string): Promise<CultureData> {
        var that = this;
        return new Promise<CultureData>(function(resolve, error) {
            var cultureData: CultureData = that.getComponent(id);
            resolve(cultureData);
        });
    }

    private getComponent(id: string): any {
        for (var component of this.components) {
            if (component.id === id) {
                return component;
            }
        }

        throw new Error("Cannot find component ID: " + component + ".");
    }
}

function toBig(input: number|string|BigJsLibrary.BigJS): BigJsLibrary.BigJS {
    switch (typeof (input)) {
        case "number":
            var numberInput = <number> input;
            var bigNumber = Big(numberInput);
            return bigNumber;
        case "string":
            var stringInput = <string> input;
            var bigString = Big(stringInput);
            return bigString;

        default:
            return <BigJsLibrary.BigJS> input;
    }
}

function getPartialDays(input: BigJsLibrary.BigJS): BigJsLibrary.BigJS {
    return input.mod(1);
}
