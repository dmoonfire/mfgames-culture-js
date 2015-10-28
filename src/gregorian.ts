/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="./init.ts"/>
import * as fs from "fs";
import * as path from "path";
import { Calendar, CalendarData } from "./init";

export class GregorianCalendar extends Calendar {
	constructor() {
		// Load the Gregorian data from the disk.
		var filename = path.join(__dirname, "..", "data", "gregorian.json");
		var fsData = fs.readFileSync(filename).toString();
		var data: CalendarData = JSON.parse(fsData);

		// Pass the loaded data to the calendar.
		super(data);
	}
}
