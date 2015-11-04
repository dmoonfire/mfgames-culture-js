/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="./init.ts"/>
import * as fs from "fs";
import * as path from "path";
import { CultureDataProvider, CalendarData, CultureData } from "./init";

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
