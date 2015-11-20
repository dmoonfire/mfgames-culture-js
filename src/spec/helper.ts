/// <reference path="../../typings/node/node.d.ts"/>
/// <reference path="../../typings/jasmine/jasmine.d.ts"/>
import * as path from "path";
import * as fs from "fs";
import { Calendar, CalendarData, CultureData, CultureDataProvider, Culture, CultureProvider } from "../init";

export class NodeFilesystemCultureDataProvider implements CultureDataProvider {
	constructor(rootDirectory?: string) {
		if (!rootDirectory) { rootDirectory == __dirname; }
		this.rootDirectory = rootDirectory;
	}

	private rootDirectory: string;

	public getCalendarData(id: string): Promise<CalendarData> {
		var that = this;
		return new Promise<CalendarData>(function(resolve, error) {
			var calendarData = that.loadCalendarData(id);
			resolve(calendarData);
		});
	}

	public getCultureData(id: string): Promise<CultureData> {
		var that = this;
		return new Promise<CultureData>(function(resolve, error) {
			var cultureData = that.loadCultureData(id);
			resolve(cultureData);
		});
	}

	private loadCalendarData(id: string): CalendarData {
		var filename = path.join(this.rootDirectory, id + ".json");
		var fsData = fs.readFileSync(filename).toString();
		var data: CalendarData = JSON.parse(fsData);
		return data;
	}

	private loadCultureData(id: string): CultureData {
		var filename = path.join(this.rootDirectory, id + ".json");
		var fsData = fs.readFileSync(filename).toString();
		var data: CultureData = JSON.parse(fsData);
		return data;
	}
}

// Set up the basic provider used for all the tests.
var rootDirectory = path.join(__dirname, "..", "..", "node_modules", "mfgames-culture-data");
var dataProvider = new NodeFilesystemCultureDataProvider(rootDirectory);
var provider = new CultureProvider(dataProvider);

/**
 * Calculates the Julian Date Number from a given year, month, day.
 */
export function getJulian(
    year: number,
    month: number,
    day: number,
    hour: number = 0,
    minute: number = 0,
    second: number = 0)
    : number {
    // Figure out the data using the formula from Wikipedia.
    var a = Math.floor((14 - month) / 12);
    var y = year + 4800 - a;
    var m = month + 12 * a - 3;
    var t = hour / 24 + minute / 24 / 60 + second / 24 / 60 / 60;
    var jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045 + t;
    return jdn - 0.5;

    //// This was the original answer, but it is wrong.
    //var date = new Date(Date.UTC(year, month, day));
    //var time = date.getTime();
    //var jd = (time / 86400000) + 2440587.5 - 31;
    //return jd;
}

export function getJulianTime(
    hour: number = 0,
    minute: number = 0,
    second: number = 0)
    : number {
    // Figure out the data using the formula from Wikipedia.
    var t = hour / 24 + minute / 24 / 60 + second / 24 / 60 / 60;
    return t - 0.5;
}

export function getCalendar(id: string): Promise<Calendar> {
    return provider.getCalendarPromise(id);
}

export function getCulture(id: string): Promise<Culture> {
    return provider.getCulturePromise(id);
}
