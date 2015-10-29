/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="./init.ts"/>
import * as fs from "fs";
import * as path from "path";
import { CultureDataProvider, CalendarData } from "./init";

export class NodeFilesystemCultureDataProvider implements CultureDataProvider {
	constructor(rootDirectory?: string) {
		if (!rootDirectory) { rootDirectory == __dirname; }
		this.rootDirectory = rootDirectory;
	}

	private rootDirectory: string;

	public getCalendarData(id: string): Promise<CalendarData> {
		var that = this;
		return new Promise<CalendarData>(function(resolve, error) {
			var calendarData = this.loadCalendarData(id);
			resolve(calendarData);
		});
	}

	private loadCalendarData(id: string): CalendarData {
		var filename = path.join(this.rootDirectory, "gregorian.json");
		var fsData = fs.readFileSync(filename).toString();
		var data: CalendarData = JSON.parse(fsData);
		return data;
	}
}
