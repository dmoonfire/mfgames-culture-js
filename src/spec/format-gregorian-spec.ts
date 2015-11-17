/// <reference path="../../typings/jasmine/jasmine.d.ts"/>
/// <reference path="./helper.ts"/>
import { Calendar, Culture } from "../init";
import { getJulian, getCalendar, getCulture } from "./helper";

describe("gregorian format", function() {
    it("can't format 2001-01-01 as INVALID", function(done) {
        getCulture("nonfiction/en-US").then(
            function(culture: Culture) {
                try {
                    var julian = getJulian(2001, 1, 1);
                    var calendar = culture.calendar;
                    var instant = calendar.getInstant(julian);
                    var formattedInstant = culture.formatInstant(instant, "INVALID");
                    fail("Incorrectly formatted a date as INVALID.")
                } catch (err) {
                    // No handling since we are testing it blowing up.
                } finally {
                    done();
                }
            },
            function(error) {
                fail("There was an error while running: " + error);
                done();
            });
    });

    it("can format 2001-01-01 as MM/DD/YYYY", function(done) {
        getCulture("nonfiction/en-US").then(
            function(culture: Culture) {
                try {
                    var julian = getJulian(2001, 1, 1);
                    var calendar = culture.calendar;
                    expect(calendar).toBeDefined();

                    var instant = calendar.getInstant(julian);
                    var formattedInstant = culture.formatInstant(instant, "MM/DD/YYYY");
                    expect(formattedInstant).toEqual("01/01/2001");
                } catch (err) {
                    fail(err);
                } finally {
                    done();
                }
            },
            function(error) {
                fail("There was an error while running: " + error);
                done();
            });
    });

    it("can format 2001-01-01 as MMM DD, YY", function(done) {
        getCulture("nonfiction/en-US").then(
            function(culture: Culture) {
                try {
                    var julian = getJulian(2001, 1, 1);
                    var calendar = culture.calendar;
                    expect(calendar).toBeDefined();

                    var instant = calendar.getInstant(julian);
                    var formattedInstant = culture.formatInstant(instant, "MMM DD, YY");
                    expect(formattedInstant).toEqual("Jan 01, 01");
                } catch (err) {
                    fail(err);
                } finally {
                    done();
                }
            },
            function(error) {
                fail("There was an error while running: " + error);
                done();
            });
    });
});
