declare module "mfgames-culture" {
    export class Calendar {
        constructor(data: CalendarData);
        private _data;
        getInstant(julianDate: number): any;
        getJulian(instant: any): number;
        private getCycleJulian(instant, cycle, working);
        private getRepeatCycleJulian(instant, cycle, working);
        private getSequenceCycleJulian(instant, cycle, working);
        private calculateCycle(cycle, julianDate, instant);
        private calculateCalculateCycle(cycle, julianDate, instant);
        private calculateRepeatCycle(cycle, julianDate, instant);
        private calculateSequenceCycle(cycle, julianDate, instant);
        private calculateLength(length, instant);
    }
    export class Culture {
        constructor(data: CultureData);
        private _data;
        calendar: Calendar;
        formatInstant(instant: any, formatId: string): string;
        parseInstant(input: string, formatId?: string): any;
        private getCycleIndex(elem, value);
        private getRegex(elements);
        private formatIndex(elem, cycleIndex);
    }
    export interface CalendarCalculationData {
        div?: number;
        ref: string;
        mod?: number;
    }
    export interface CalendarLengthData {
        count: number;
        julian?: number;
        single?: Array<CalendarLengthData>;
        ref?: string;
        operation?: string;
        value?: number;
    }
    export interface CalendarCycleData {
        id: string;
        type: string;
        cycles: Array<CalendarCycleData>;
        lengths?: Array<CalendarLengthData>;
        ref?: string;
        value?: number;
        operation?: string;
    }
    export interface ComponentData {
        id: string;
        version: number;
    }
    export interface CalendarData extends ComponentData {
        julian?: number;
        cycles?: Array<CalendarCycleData>;
    }
    export interface CultureTemporalFormatElementData {
        ref?: string;
        constant?: string;
        minDigits?: number;
        maxDigits?: number;
        offset?: number;
        prefix?: string;
        suffix?: string;
        lookup?: boolean;
        maxValue?: number;
        minValue?: number;
        parseRef?: string;
        parseOffset?: number;
    }
    export interface CultureTemporalData {
        calendars: Array<string>;
        formats: {
            [id: string]: Array<CultureTemporalFormatElementData>;
        };
    }
    export interface CultureData extends ComponentData {
        temporal?: CultureTemporalData;
        lookups: {
            [id: string]: string;
        };
    }
    export interface CultureDataProvider {
        getCalendarData(id: string): Promise<CalendarData>;
        getCultureData(id: string): Promise<CultureData>;
    }
    export class NodeFilesystemCultureDataProvider implements CultureDataProvider {
        constructor(rootDirectory?: string);
        private rootDirectory;
        getCalendarData(id: string): Promise<CalendarData>;
        getCultureData(id: string): Promise<CultureData>;
        private loadCalendarData(id);
        private loadCultureData(id);
    }
    export class ArrayCultureDataProvider implements CultureDataProvider {
        constructor(components: Array<ComponentData>);
        getCalendarData(id: string): Promise<CalendarData>;
        getCultureData(id: string): Promise<CultureData>;
    }
    export class CultureProvider {
        constructor(dataProvider: CultureDataProvider);
        private _dataProvider;
        getCalendarPromise(id: string): Promise<Calendar>;
        getCulturePromise(id: string): Promise<Culture>;
    }
}
