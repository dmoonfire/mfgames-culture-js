import * as Promise from "bluebird";
import { CalendarData, CalendarCycleData, CalendarLengthData, CultureData, CultureTemporalData, CultureTemporalFormatElementData, CultureDataProvider, ComponentData } from "./interfaces";

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

        throw new Error("Cannot find component ID: '" + id + "'.");
    }
}

export class HashCultureDataProvider implements CultureDataProvider {
    constructor(components: any) {
        this.components = components;
    }

    private components: any;

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
        if (id in this.components) {
            return this.components[id];
        }

        throw new Error("Cannot find component ID: '" + id + "'.");
    }
}
