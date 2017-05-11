const expect = require("expect");
import { Calendar, Culture } from "../index";
import { getJulian, getCalendar, getCulture } from "./helper";

describe("gregorian/decimal format", function() {
    it("can format 2001-01-01 00:00:00 as YYYY-MM-DD HH:mm:ss", function(done) {
        getCulture("en-US").then(
            function(culture: Culture) {
                try {
                    var julian = getJulian(2001, 1, 1, 0, 0, 0);
                    var calendar = culture.calendar;
                    expect(calendar).toExist();

                    var instant = calendar.getInstant(julian);
                    var formattedInstant = culture.formatInstant(instant, "YYYY-MM-DD HH:mm:ss");
                    expect(formattedInstant).toEqual("2001-01-01 00:00:00");
                    done();
                } catch (exception) {
                    done(exception);
                }
            },
            function(error) { done(error); });
    });

    it("can format 2001-01-01 01:02:03 as YYYY-MM-DD HH:mm:ss", function(done) {
        getCulture("en-US").then(
            function(culture: Culture) {
                try {
                    var julian = getJulian(2001, 1, 1, 1, 2, 3);
                    var calendar = culture.calendar;
                    expect(calendar).toExist();

                    var instant = calendar.getInstant(julian);
                    var formattedInstant = culture.formatInstant(instant, "YYYY-MM-DD HH:mm:ss");
                    expect(formattedInstant).toEqual("2001-01-01 01:02:03");
                    done();
                } catch (exception) {
                    done(exception);
                }
            },
            function(error) { done(error); });
    });


    it("can format 2001-01-01 13:12:14 as YYYY-MM-DD HH:mm:ss", function(done) {
        getCulture("en-US").then(
            function(culture: Culture) {
                try {
                    var julian = getJulian(2001, 1, 1, 13, 12, 14);
                    var calendar = culture.calendar;
                    expect(calendar).toExist();

                    var instant = calendar.getInstant(julian);
                    var formattedInstant = culture.formatInstant(instant, "YYYY-MM-DD HH:mm:ss");
                    expect(formattedInstant).toEqual("2001-01-01 13:12:14");
                    done();
                } catch (exception) {
                    done(exception);
                }
            },
            function(error) { done(error); });
    });

    it("can format 2001-01-01 13:12:14 as MM/DD/YYYY h:mm:ss tt", function(done) {
        getCulture("en-US").then(
            function(culture: Culture) {
                try {
                    var julian = getJulian(2001, 1, 1, 13, 12, 14);
                    var calendar = culture.calendar;
                    expect(calendar).toExist();

                    var instant = calendar.getInstant(julian);
                    var formattedInstant = culture.formatInstant(instant, "MM/DD/YYYY h:mm:ss tt");
                    expect(formattedInstant).toEqual("01/01/2001 1:12:14 pm");
                    done();
                } catch (exception) {
                    done(exception);
                }
            },
            function(error) { done(error); });
    });
});
