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
    offset?: number;
    partialDaysOnly?: boolean;
}
export interface ComponentData {
    id: string;
    version: number;
    type: string;
}
export interface CultureTemporalFormatElementData {
    ref?: string;
    constant?: string;
    default?: any;
    minDigits?: number;
    maxDigits?: number;
    offset?: number;
    prefix?: string;
    suffix?: string;
    lookup?: boolean;
    maxValue?: number;
    minValue?: number;
    parseRef?: string;
}
export interface CultureTemporalData {
    calendars: Array<string>;
    instantFormats: {
        [id: string]: Array<CultureTemporalFormatElementData>;
    };
}
export interface CalendarData extends ComponentData {
    cycles?: Array<CalendarCycleData>;
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
export declare class Calendar {
    constructor(data: CalendarData);
    data: CalendarData;
    private _bigCache;
    getInstant(input: number | string | BigJsLibrary.BigJS): any;
    getJulian(instant: any): number;
    getBigJulian(instant: any): BigJsLibrary.BigJS;
    private getCycleJulian(instant, cycle, working);
    private getRepeatCycleJulian(instant, cycle, working);
    private getSequenceCycleJulian(instant, cycle, working);
    private calculateCycle(cycle, julian, instant);
    private calculateCalculateCycle(cycle, julian, instant);
    private calculateRepeatCycle(cycle, julian, instant);
    private calculateSequenceCycle(cycle, julian, instant);
    private calculateLength(cacheKey, length, instant);
    private getCachedBig(key, input);
}
export declare class Culture {
    constructor(data: CultureData);
    private _data;
    calendar: Calendar;
    getTemporalFormats(): Array<string>;
    formatInstant(instant: any, formatId: string): string;
    parseInstant(input: string, formatId?: string): any;
    private isNumeric(input);
    private getCycleIndex(elem, value);
    private getRegex(elements);
    private formatIndex(elem, cycleIndex);
}
export declare class CultureProvider {
    constructor(dataProvider: CultureDataProvider);
    private _dataProvider;
    getCalendarPromise(id: string): Promise<Calendar>;
    getCulturePromise(id: string): Promise<Culture>;
    private combineCalendars(calendars);
}
export declare class ArrayCultureDataProvider implements CultureDataProvider {
    constructor(components: Array<ComponentData>);
    private components;
    getCalendarData(id: string): Promise<CalendarData>;
    getCultureData(id: string): Promise<CultureData>;
    private getComponent(id);
}
