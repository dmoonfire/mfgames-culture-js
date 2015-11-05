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

/**
 * The metadata and top-level information for calendar data.
 */
export interface CalendarData {
    version: number;
    id: string;
    julian?: number;
    cycles?: Array<CalendarCycleData>;
}
export interface CultureTemporalFormatElementData {
    ref?: string;
    constant?: string;
    minDigits?: number;
    maxDigits?: number,
    offset?: number;
    prefix?: string;
    suffix?: string;
    lookup?: boolean;
    maxValue?: number,
    minValue?: number,
    parseRef?: string,
    parseOffset?: number
}
export interface CultureTemporalData {
    calendars: Array<string>;
    formats: { [id: string]: Array<CultureTemporalFormatElementData> };
}
export interface CultureData {
    id: string;
    version: number;
    temporal?: CultureTemporalData;
    lookups: { [id: string]: string };
}
export interface CultureDataProvider {
    getCalendarData(id: string): Promise<CalendarData>;
    getCultureData(id: string): Promise<CultureData>;
}
