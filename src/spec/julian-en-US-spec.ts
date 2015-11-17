/// <reference path="../../typings/jasmine/jasmine.d.ts"/>
/// <reference path="./helper.ts"/>
import { Calendar, Culture } from "../init";
import { getJulian, getCalendar, getCulture } from "./helper";

describe("get instant from gregorian text", function() {
    it("julian 01/01/2000", function(done) {
        getCulture("nonfiction/en-US").then(
            function(culture: Culture) {
                try {
                    var julian = getJulian(2000, 1, 1);
                    var instant = culture.parseInstant("" + julian);
                    var calendar = culture.calendar;
                    var expected = calendar.getInstant(julian);
                    expect(instant).toEqual(expected);
                } catch (exception) {
                    fail(exception);
                } finally {
                    done();
                }
            },
            function(error) {
                fail("There was an error while running: " + error);
                done();
            });
    });

    it("01/01/2000", function(done) {
        getCulture("nonfiction/en-US").then(
            function(culture: Culture) {
                try {
                    var instant = culture.parseInstant("01/01/2000", "MM/DD/YYYY");
                    var calendar = culture.calendar;
                    var expected = calendar.getInstant(getJulian(2000, 1, 1));
                    expect(instant).toEqual(expected);
                } catch (exception) {
                    fail(exception);
                } finally {
                    done();
                }
            },
            function(error) {
                fail("There was an error while running: " + error);
                done();
            });
    });

    it("01/01/2000 unspecified", function(done) {
        getCulture("nonfiction/en-US").then(
            function(culture: Culture) {
                try {
                    var instant = culture.parseInstant("01/01/2000");
                    var calendar = culture.calendar;
                    var expected = calendar.getInstant(getJulian(2000, 1, 1));
                    expect(instant).toEqual(expected);
                } catch (exception) {
                    fail(exception);
                } finally {
                    done();
                }
            },
            function(error) {
                fail("There was an error while running: " + error);
                done();
            });
    });

    it("Feb 03, 12", function(done) {
        getCulture("nonfiction/en-US").then(
            function(culture: Culture) {
                try {
                    var instant = culture.parseInstant("Feb 03, 12", "MMM DD, YY");
                    var calendar = culture.calendar;
                    var expected = calendar.getInstant(getJulian(2012, 2, 3));
                    expect(instant).toEqual(expected);
                } catch (exception) {
                    fail(exception);
                } finally {
                    done();
                }
            },
            function(error) {
                fail("There was an error while running: " + error);
                done();
            });
    });

    it("Feb 03, 12 unspecified", function(done) {
        getCulture("nonfiction/en-US").then(
            function(culture: Culture) {
                try {
                    var instant = culture.parseInstant("Feb 03, 12");
                    var calendar = culture.calendar;
                    var expected = calendar.getInstant(getJulian(2012, 2, 3));
                    expect(instant).toEqual(expected);
                } catch (exception) {
                    fail(exception);
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
