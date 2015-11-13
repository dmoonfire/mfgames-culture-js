import * as data from "./data";
import { Calendar } from "./calendar";

export class Culture {
    constructor(data: data.CultureData) {
        if (!data) { throw new Error("Cannot create a culture without data.") }
        this._data = data;
    }

    private _data: data.CultureData;
    public calendar: Calendar;

    public getTemporalFormats(): Array<string> {
        var formats = new Array<string>();

        if (this._data.temporal) {
            var formatData = this._data.temporal.formats;

            for (var format in formatData) {
                formats.push(format);
            }
        }

        return formats;
    }
    public formatInstant(instant: any, formatId: string): string {
        // First make sure this is a known format for this culture.
        var elements = this._data.temporal.formats[formatId];
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
            if (!(formatId in this._data.temporal.formats)) {
                throw new Error("Unknown temporal format: " + formatId + ".");
            }
        } else {
            // We have to search for the format. We do this by cycling through
            // until we find a regex that matches.
            var found = false;

            for (var fmtId in this._data.temporal.formats) {
                var fmt = this._data.temporal.formats[fmtId];
                var fmtRegex = this.getRegex(fmt);

                if (fmtRegex.test(input)) {
                    formatId = fmtId;
                    found = true;
                    break;
                }
            }

            // If we didn't find it, see if this could be a JDN.
            if (!found && this.isNumeric(input)) {
                var julian = parseFloat(input);
                var populatedInstant = this.calendar.getInstant(julian);
                return populatedInstant;
            }

            // If we didn't find it, we have a problem.
            if (!found) {
                throw new Error("Cannot infer format from " + input + ".");
            }
        }

        // Grab the format and see if this matches the input.
        var formatElements = this._data.temporal.formats[formatId];
        var regex = this.getRegex(formatElements);
        var isMatch = regex.test(input);

        if (!isMatch) {
            throw new Error("Cannot find a match for parsing the input: " + input + ".");
        }

        // Go through the elements and pull out each one.
        var matches = input.match(regex);
        var matchIndex = 1;
        var instant = {};

        for (var elem of formatElements) {
            // If we have a constant, then skip it.
            if (elem.constant) { continue; }

            // Pull out the elements and reverse the value.
            var ref = elem.parseRef ? elem.parseRef : elem.ref;
            var value = matches[matchIndex++];
            var cycleIndex = this.getCycleIndex(elem, value);

            if (elem.parseOffset) { cycleIndex += elem.parseOffset }

            instant[ref] = cycleIndex;
        }

        // This is a partial instant, so convert it to Julian and then back into
        // a fully populated object.
        var julian = this.calendar.getJulian(instant);
        var populatedInstant = this.calendar.getInstant(julian);
        return populatedInstant;
    }

    private isNumeric(input: string) {
        var n = parseFloat(input);
        return !isNaN(n) && isFinite(n);
    }

    private getCycleIndex(elem: data.CultureTemporalFormatElementData, value: string): number {
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

    private getRegex(elements: Array<data.CultureTemporalFormatElementData>): RegExp {
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

    private formatIndex(elem: data.CultureTemporalFormatElementData, cycleIndex: number): string {
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
