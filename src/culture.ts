import * as data from "./data";
import { Calendar } from "./calendar";

export class Culture {
    constructor(data: data.CultureData) {
        if (!data) { throw new Error("Cannot create a culture without data.") }
        this._data = data;
    }

    private _data: data.CultureData;
    public calendar: Calendar;

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

                // If we have an offset, modify to get the right value.
                if (elem.offset) { cycleIndex += elem.offset; }

                // First handle any zero-padding.
                var value: string = cycleIndex.toString();

                if (elem.digits) {
                    while (value.length < elem.digits) {
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

                // Add the formatted value to the buffer.
                buffer += value;
            }
        }

        // Return the resulting text.
        return buffer;
    }
}
