/**
 * Defines the JSON signature for cycle length calculations. This is used by
 * both the repeat and sequence cycles.
 *
 * @interface
 */
export interface CalendarLengthData {
    /**
     * The amount to adjust a *cycle index* when this length is applied. This
     * must be a whole number (1 or higher integer).
     */
    count: number;

    /**
     * The amount to modify the Julian Day Number when this length is valid for
     * a cycle calculation. Typically `julian` or `single` is required to
     * calculate the length of a cycle.
     */
    julian?: number;

    /**
     * A series of length elements that have various calculations. Only one
     * length within the single is selected, the first one that is valid for
     * the current state.
     */
    single?: Array<CalendarLengthData>;

    /**
     * The reference to a calculated cycle id. This is used with the operation
     * and value properties to determine if this length is valid for the current
     * state. Only cycles that were already calculated, such as parent cycles
     * and ones earlier in the sequence, can be referenced.
     *
     * This is only required with conditional lengths.
     */
    ref?: string;

    /**
     * The operation used to determine if a length is valid. This is used with
     * ref and value. The only values can be "div" and "mod".
     *
     * This is only required with conditional lengths.
     */
    operation?: string;

    /**
     * The value used for the operations and ref properties. The value is
     * determined by the operation, which requires an integer value.
     *
     * This is only required with conditional lengths.
     */
    value?: number;

    /**
     * The value to determine if cycle length calculations should stop looping
     * if the length returned a valid value.
     */
    stopIfValid: boolean;
}

/**
 * Defines the JSON data for a calendar cycle.
 *
 * @interface
 */
export interface CalendarCycleData {
    /**
     * The identifier for the cycle. This must be unique not only within a
     * single calendar but also all other combined calendars used by a given
     * culture.
     */
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

/**
 * Base class for all top-level culture components.
 */
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

    /**
    * An offset for the resulting Julian date while parsing to avoid doubling
    * changes while using two different calendars.
    */
    parseJulianOffset?: number|string;
}

export interface CultureTemporalData {
    calendars: Array<string>;
    instantFormats: { [id: string]: Array<CultureTemporalFormatElementData> };
}
/**
 * The metadata and top-level information for calendar
 */
export interface CalendarData extends ComponentData {
    cycles?: Array<CalendarCycleData>;
}

export interface CultureData extends ComponentData {
    temporal?: CultureTemporalData;
    lookups: { [id: string]: string };
}
export interface CultureDataProvider {
    getCalendarData(id: string): Promise<CalendarData>;
    getCultureData(id: string): Promise<CultureData>;
}
