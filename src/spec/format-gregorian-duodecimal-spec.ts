/// <reference path="../../typings/jasmine/jasmine.d.ts"/>
/// <reference path="./helper.ts"/>
import { Calendar, Culture } from "../init";
import { getJulian, getCalendar, getCulture } from "./helper";

describe("gregorian/decimal format", function() {
    it("can format 2001-01-01 00:00:00 as YYYY-MM-DD HH:mm:ss", function(done) {
        getCulture("nonfiction/en-US").then(
            function(culture: Culture) {
                try {
                    var julian = getJulian(2001, 1, 1, 0, 0, 0);
                    var calendar = culture.calendar;
                    expect(calendar).toBeDefined();

                    var instant = calendar.getInstant(julian);
                    var formattedInstant = culture.formatInstant(instant, "YYYY-MM-DD HH:mm:ss");
                    expect(formattedInstant).toEqual("2001-01-01 00:00:00");
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

    it("can format 2001-01-01 01:02:03 as YYYY-MM-DD HH:mm:ss", function(done) {
        getCulture("nonfiction/en-US").then(
            function(culture: Culture) {
                try {
                    var julian = getJulian(2001, 1, 1, 1, 2, 3);
                    var calendar = culture.calendar;
                    expect(calendar).toBeDefined();

                    var instant = calendar.getInstant(julian);
                    var formattedInstant = culture.formatInstant(instant, "YYYY-MM-DD HH:mm:ss");
                    expect(formattedInstant).toEqual("2001-01-01 01:02:03");
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


    it("can format 2001-01-01 13:12:14 as YYYY-MM-DD HH:mm:ss", function(done) {
        getCulture("nonfiction/en-US").then(
            function(culture: Culture) {
                try {
                    var julian = getJulian(2001, 1, 1, 13, 12, 14);
                    var calendar = culture.calendar;
                    expect(calendar).toBeDefined();

                    var instant = calendar.getInstant(julian);
                    var formattedInstant = culture.formatInstant(instant, "YYYY-MM-DD HH:mm:ss");
                    expect(formattedInstant).toEqual("2001-01-01 13:12:14");
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

    it("can format 2001-01-01 13:12:14 as MM/DD/YYYY h:mm:ss tt", function(done) {
        getCulture("nonfiction/en-US").then(
            function(culture: Culture) {
                try {
                    var julian = getJulian(2001, 1, 1, 13, 12, 14);
                    var calendar = culture.calendar;
                    expect(calendar).toBeDefined();

                    var instant = calendar.getInstant(julian);
                    var formattedInstant = culture.formatInstant(instant, "MM/DD/YYYY h:mm:ss tt");
                    expect(formattedInstant).toEqual("01/01/2001 1:12:14 pm");
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
