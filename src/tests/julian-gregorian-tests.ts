const expect = require("expect");
import { Calendar } from "../index";
import { getJulian, getCalendar } from "./helper";

describe("calculate julian from gregorian", function() {
    it("2000-01-01", function(done) {
        getCalendar("gregorian").then(
            function(calendar: Calendar) {
                try {
                    var instant = { year: 2000, yearMonth: 0, monthDay: 0 };
                    var julian = calendar.getJulian(instant);
                    var expected = getJulian(2000, 1, 1);
                    expect(julian).toEqual(expected);
                    done();
                } catch (exception) {
                    done(exception);
                }
            },
            function(error) { done(error); });
    });

    it("2000-02-01", function(done) {
        getCalendar("gregorian").then(
            function(calendar: Calendar) {
                try {
                    var instant = { year: 2000, yearMonth: 1, monthDay: 0 };
                    var julian = calendar.getJulian(instant);
                    var expected = getJulian(2000, 2, 1);
                    expect(julian).toEqual(expected);
                    done();
                } catch (exception) {
                    done(exception);
                }
            },
            function(error) { done(error); });
    });

    it("2000-02-02", function(done) {
        getCalendar("gregorian").then(
            function(calendar: Calendar) {
                try {
                    var instant = { year: 2000, yearMonth: 1, monthDay: 1 };
                    var julian = calendar.getJulian(instant);
                    var expected = getJulian(2000, 2, 2);
                    expect(julian).toEqual(expected);
                    done();
                } catch (exception) {
                    done(exception);
                }
            },
            function(error) { done(error); });
    });

    it("2001-01-01", function(done) {
        getCalendar("gregorian").then(
            function(calendar: Calendar) {
                try {
                    var instant = { year: 2001, yearMonth: 0, monthDay: 0 };
                    var julian = calendar.getJulian(instant);
                    var expected = getJulian(2001, 1, 1);
                    expect(julian).toEqual(expected);
                    done();
                } catch (exception) {
                    done(exception);
                }
            },
            function(error) { done(error); });
    });

    it("2002-01-01", function(done) {
        getCalendar("gregorian").then(
            function(calendar: Calendar) {
                try {
                    var instant = { year: 2002, yearMonth: 0, monthDay: 0 };
                    var julian = calendar.getJulian(instant);
                    var expected = getJulian(2002, 1, 1);
                    expect(julian).toEqual(expected);
                    done();
                } catch (exception) {
                    done(exception);
                }
            },
            function(error) { done(error); });
    });

    it("2003-01-01", function(done) {
        getCalendar("gregorian").then(
            function(calendar: Calendar) {
                try {
                    var instant = { year: 2003, yearMonth: 0, monthDay: 0 };
                    var julian = calendar.getJulian(instant);
                    var expected = getJulian(2003, 1, 1);
                    expect(julian).toEqual(expected);
                    done();
                } catch (exception) {
                    done(exception);
                }
            },
            function(error) { done(error); });
    });

    it("2004-01-01", function(done) {
        getCalendar("gregorian").then(
            function(calendar: Calendar) {
                try {
                    var instant = { year: 2004, yearMonth: 0, monthDay: 0 };
                    var julian = calendar.getJulian(instant);
                    var expected = getJulian(2004, 1, 1);
                    expect(julian).toEqual(expected);
                    done();
                } catch (exception) {
                    done(exception);
                }
            },
            function(error) { done(error); });
    });

    it("2100-01-01", function(done) {
        getCalendar("gregorian").then(
            function(calendar: Calendar) {
                try {
                    var instant = { year: 2100, yearMonth: 0, monthDay: 0 };
                    var julian = calendar.getJulian(instant);
                    var expected = getJulian(2100, 1, 1);
                    expect(julian).toEqual(expected);
                    done();
                } catch (exception) {
                    done(exception);
                }
            },
            function(error) { done(error); });
    });

    it("2101-01-01", function(done) {
        getCalendar("gregorian").then(
            function(calendar: Calendar) {
                try {
                    var instant = { year: 2101, yearMonth: 0, monthDay: 0 };
                    var julian = calendar.getJulian(instant);
                    var expected = getJulian(2101, 1, 1);
                    expect(julian).toEqual(expected);
                    done();
                } catch (exception) {
                    done(exception);
                }
            },
            function(error) { done(error); });
    });
});
