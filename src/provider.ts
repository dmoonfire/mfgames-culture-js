import * as data from "./data";
import { Calendar } from "./calendar";
import { Culture } from "./culture";

export class CultureProvider {
    constructor(dataProvider: data.CultureDataProvider) {
        if (!dataProvider) {
            throw new Error("Cannot create a CultureProvider without a data provider.")
        }

        this._dataProvider = dataProvider;
    }

    private _dataProvider: data.CultureDataProvider;

    public getCalendarPromise(id: string): Promise<Calendar> {
        var that = this;
        return new Promise<Calendar>(
            function(resolve, error) {
                var dataPromise = that._dataProvider.getCalendarData(id);

                dataPromise.then(
                    function(data) {
                        resolve(new Calendar(data));
                    },
                    function(dataError) {
                        error(dataError);
                    });
            });
    }

    public getCulturePromise(id: string): Promise<Culture> {
        var that = this;
        return new Promise<Culture>(
            function(resolve, error) {
                var dataPromise = that._dataProvider.getCultureData(id);

                dataPromise.then(
                    function(data) {
                        // Create the base culture from the data.
                        var culture = new Culture(data);

                        // We need to load all the calendars for this culture.
                        // Since these are loaded via promises, we need to
                        // resolve all of them.
                        var calendarPromises = Array<Promise<Calendar>>();

                        if (data.temporal && data.temporal.calendars) {
                            for (var calendarId of data.temporal.calendars) {
                                var calendarPromise = that.getCalendarPromise(calendarId);
                                calendarPromises.push(calendarPromise);
                            }
                        }

                        var allCalendarPromises = Promise.all(calendarPromises);

                        allCalendarPromises.then(
                            function(promises) {
                                // If we have no promises, nothing to worry about.
                                if (promises.length == 0) { }
                                else if (promises.length == 1) {
                                    culture.calendar = promises[0];
                                }
                                else { throw new Error("Cannot assign multiple calendars."); }

                                // Resolve the culture.
                                resolve(culture);
                            }
                            )
                    },
                    function(dataError) {
                        error(dataError);
                    });
            });
    }
}
