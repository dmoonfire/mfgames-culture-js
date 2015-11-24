declare module "mfgames-culture-js" {
    export class Calendar {
        constructor(data: CalendarData);
        getInstant(julianDate: number): any;
        getJulian(instant: any): number;
    }
    export class Culture {
        constructor(data: CultureData);
        calendar: Calendar;
        getTemporalFormats(): Array<string>;
        formatInstant(instant: any, formatId: string): string;
        parseInstant(input: string, formatId?: string): any;
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
        getCalendarData(id: string): Promise<CalendarData>;
        getCultureData(id: string): Promise<CultureData>;
    }
    export class ArrayCultureDataProvider implements CultureDataProvider {
        constructor(components: Array<ComponentData>);
        getCalendarData(id: string): Promise<CalendarData>;
        getCultureData(id: string): Promise<CultureData>;
    }
    export class CultureProvider {
        constructor(dataProvider: CultureDataProvider);
        getCalendarPromise(id: string): Promise<Calendar>;
        getCulturePromise(id: string): Promise<Culture>;
    }
}
