/// <reference path="../../typings/jasmine/jasmine.d.ts"/>
/// <reference path="./helper.ts"/>
import { Calendar } from "../init";
import { getJulian, getCalendar } from "./helper";

describe("duodecimal calendar", function() {
    it("can get components for 00:00:00", function(done) {
        getCalendar("nonfiction/duodecimal").then(
            function(cal: Calendar) {
                try {
                    var julian = 0.5 + 0 / 24 + 0 / 1440 + 0 / 86400;
                    var point = cal.getInstant(julian);
                    expect(point).toEqual({
                        julian: 0.5,
                        hour24: 0,
                        hour12: 0,
                        hourMinute: 0,
                        dayMinute: 0,
                        minuteSecond: 0,
                        meridiem: 0
                    });
                    done();
                } catch (exception) {
                    done(exception);
                }
            },
            function(error) {
                done("There was an error while running: " + error);
            });
    });

    it("can get components for 12:00:00", function(done) {
        getCalendar("nonfiction/duodecimal").then(
            function(cal: Calendar) {
                try {
                    var julian = 0.5 + 12 / 24 + 0 / 1440 + 0 / 86400;
                    var point = cal.getInstant(julian);
                    expect(point).toEqual({
                        julian: 1,
                        hour24: 12,
                        hour12: 0,
                        hourMinute: 0,
                        dayMinute: 43200,
                        minuteSecond: 0,
                        meridiem: 1
                    });
                    done();
                } catch (exception) {
                    done(exception);
                }
            },
            function(error) {
                done("There was an error while running: " + error);
            });
    });
});
