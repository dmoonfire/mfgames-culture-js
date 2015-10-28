/// <reference path="../typings/node/node.d.ts"/>
import * as fs from "fs";
import * as path from "path";

module MfGamesCulture {
	export interface CalendarCalculationData {
		div?: number;
		ref: string;
		mod?: number;
	}
	export interface CalendarLengthData {
		count: number;
		julian?: number;
		choose?: Array<CalendarLengthData>;
		ref?: string;
	}
	export interface CalendarCycleData {
		id: string;
		cycles: Array<CalendarCycleData>;
		calculate?: CalendarCalculationData;
		lengths?: Array<CalendarLengthData>;
	}

	/**
	 * The metadata and top-level information for calendar data.
	 */
	export interface CalendarData {
		version: number;
		id: string;
		julian?: number;
		cycles?: Array<CalendarCycleData>;
	}

    export class Calendar {
        constructor(data: CalendarData) {
            this._data = data;
        }

		private _data: CalendarData;
    }

	export class GregorianCalendar extends MfGamesCulture.Calendar {
		constructor() {
			// Load the Gregorian data from the disk.
			var filename = path.join(__dirname, "gregorian.json");
			var data: MfGamesCulture.CalendarData = fs.readFileSync(filename).toJSON();

			// Pass the loaded data to the calendar.
			super(data);
		}
	}
}
