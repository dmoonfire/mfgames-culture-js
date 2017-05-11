const expect = require("expect");
import { Calendar, Culture } from "../index";
import { getJulian, getCalendar, getCulture } from "./helper";

describe("gregorian format", function() {
    it("can't format 2001-01-01 as INVALID", function(done) {
        getCulture("en-US").then(
            function(culture: Culture) {
                try {
                    var julian = getJulian(2001, 1, 1);
                    var calendar = culture.calendar;
                    var instant = calendar.getInstant(julian);
                    var formattedInstant = culture.formatInstant(instant, "INVALID");
                    done(new Error("Incorrectly formatted a date as INVALID."));
                } catch (exception) {
                    done();
                }
            },
            function(error) { done(error); });
    });

    it("can format 2001-01-01 as MM/DD/YYYY", function(done) {
        getCulture("en-US").then(
            function(culture: Culture) {
                try {
                    var julian = getJulian(2001, 1, 1);
                    var calendar = culture.calendar;
                    expect(calendar).toExist();

                    var instant = calendar.getInstant(julian);
                    var formattedInstant = culture.formatInstant(instant, "MM/DD/YYYY");
                    expect(formattedInstant).toEqual("01/01/2001");
                    done();
                } catch (exception) {
                    done(exception);
                }
            },
            function(error) { done(error); });
    });

    it("can format 2001-01-01 as MMM DD, YY", function(done) {
        getCulture("en-US").then(
            function(culture: Culture) {
                try {
                    var julian = getJulian(2001, 1, 1);
                    var calendar = culture.calendar;
                    expect(calendar).toExist();

                    var instant = calendar.getInstant(julian);
                    var formattedInstant = culture.formatInstant(instant, "MMM DD, YY");
                    expect(formattedInstant).toEqual("Jan 01, 01");
                    done();
                } catch (exception) {
                    done(exception);
                }
            },
            function(error) { done(error); });
    });
});
