import * as data from "./data";

export class Calendar {
    constructor(data: data.CalendarData) {
        this._data = data;
    }

    private _data: data.CalendarData;

    public getInstant(julianDate: number): any {
        // Set up the default instant.
        var instant = {julian: julianDate};

        // If we have an offset, modify the date by it.
        if (this._data.julian) { julianDate += this._data.julian }

        // Go through each of the cycles and calculate each one. We will reset
        // the julian date for each one since each of these cycles is calculated
        // independently.
        for (var cycle of this._data.cycles) {
            this.calculateCycle(cycle, julianDate, instant);
        }

        // Return the resulting calendar instant.
        return instant;
    }

    public getJulian(instant: any): number {
        // Loop through the top-level cycles and see if any of these will work.
        // If they do, calculate the Julian Date. At the moment, we include all
        // of the root elements which will handle composite calendars.
        var julian: number = -this._data.julian;
        var working = {};

        for (var cycle of this._data.cycles) {
            var cycleJulian = this.getCycleJulian(instant, cycle, working);
            julian += cycleJulian;
        }

        // Return the resulting julian.
        return julian;
    }

    private getCycleJulian(instant: any, cycle: data.CalendarCycleData, working: any): number {
        // If we don't have the index for the cycle, then skip it.
        if (!(cycle.id in instant)) {
            return 0;
        }

        // Figure out the type of cycle, since that will determine how we
        // calcualte it.
        var julian = 0;
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
                julian += this.getCycleJulian(instant, child, working);
            }
        }

        // Pull out the index and calculate the values.
        return julian;
    }

    private getRepeatCycleJulian(instant: any, cycle: data.CalendarCycleData, working: any): number {
        // Start with the base cycle and zero out the index of the working set.
        var index = instant[cycle.id];
        var julian = 0;
        working[cycle.id] = 0;

        // Loop through the types, processing each one until we run out.
        while (working[cycle.id] <= index) {
            // Calculate the length of the next cycle by finding the next one.
            var found = false;

            for (var length of cycle.lengths) {
                // If this cycle would have put us over, skip it.
                if (length.count + working[cycle.id] > index) { continue; }

                // Calculate the length of this length. If this is less than or
                // equal to the Julian Date, we need to keep it.
                var next = this.calculateLength(length, working);

                if (next <= 0) { continue; }

                working[cycle.id] += length.count;
                julian += next;
                found = true;
                break;
            }

            // If we fall through, then there is something wrong so break out.
            if (!found) { break; }
        }

        // Return the resulting Julian date.
        return julian;
    }

    private getSequenceCycleJulian(instant: any, cycle: data.CalendarCycleData, working: any): number {
        // Start with the base cycle and zero out the index of the working set.
        var index = instant[cycle.id];
        var julian = 0;
        working[cycle.id] = 0;

        // Loop through the sequence lengths until we exceed our limit.
        for (var cycleIndex = 0; cycleIndex < index; cycleIndex++) {
            // Update the working with the current cycle.
            working[cycle.id] = cycleIndex;

            // Calculate the length of this sequence.
            var length = cycle.lengths[cycleIndex];
            var next = this.calculateLength(length, instant);

            julian += next;
        }

        // Return the resulting Julian date.
        return julian;
    }

    private calculateCycle(cycle: data.CalendarCycleData, julianDate: number, instant: any): void {
        // Figure out what to do based on the type of the cycle.
        switch (cycle.type) {
            case "repeat":
                this.calculateRepeatCycle(cycle, julianDate, instant);
                break;

            case "calculate":
                this.calculateCalculateCycle(cycle, julianDate, instant);
                break;

            case "sequence":
                this.calculateSequenceCycle(cycle, julianDate, instant);
                break;

            default: throw "Cannot handle cycle type of " + cycle.type + ".";
        }
    }

    private calculateCalculateCycle(cycle: data.CalendarCycleData, julianDate: number, instant: any): void {
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
                this.calculateCycle(child, julianDate, instant);
            }
        }
    }

    private calculateRepeatCycle(cycle: data.CalendarCycleData, julianDate: number, instant: any): void {
        // Start with the zero index.
        instant[cycle.id] = 0;

        // Loop through the various lengths until we encounter a length that
        // exceeds the remaining Julian Date.
        var next = 0;

        while (julianDate >= 0) {
            // Calculate the length of the next cycle by finding the next one.
            var found = false;

            for (var length of cycle.lengths) {
                // Calculate the length of this length. If this is less than or
                // equal to the Julian Date, we need to keep it.
                next = this.calculateLength(length, instant);

                if (next <= 0) { continue; }

                if (next <= julianDate) {
                    instant[cycle.id] += length.count;
                    julianDate -= next;
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
                this.calculateCycle(child, julianDate, instant);
            }
        }
    }

    private calculateSequenceCycle(cycle: data.CalendarCycleData, julianDate: number, instant: any): void {
        // Start with the zero index.
        instant[cycle.id] = 0;

        //console.log("seq", cycle.id, "begin", julianDate);

        // Loop through the sequences until we exceed our limit.
        var found = false;

        for (var length of cycle.lengths) {
            // Calculate the length of this length. If this is less than or
            // equal to the Julian Date, we need to keep it and move to the next.
            var next = this.calculateLength(length, instant);

            //console.log("seq", cycle.id, "next", julianDate, next);

            if (next <= 0 || next > julianDate) { break; }

            // Adjust the instant cycle index and move to the next.
            instant[cycle.id]++;
            julianDate -= next;

            // If we hit zero, we're done.
            if (julianDate <= 0) { break; }
        }

        //console.log("seq", cycle.id, "end", julianDate, instant[cycle.id]);

        // If we have additional cycles, we want to calculate them recursively.
        if (cycle.cycles) {
            for (var child of cycle.cycles) {
                this.calculateCycle(child, julianDate, instant);
            }
        }
    }

    private calculateLength(length: data.CalendarLengthData, instant: any): number {
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
                return single.julian;
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
                    if (index % value != 0) { return 0; }
                    break;

                case "div":
                    if (Math.floor(index / value) != 0) { return 0; }
                    break;
            }
        }

        // We have a valid value, so return the results.
        return length.julian;
    }
}
