/// <reference path="../../typings/jasmine/jasmine.d.ts"/>
/// <reference path="../../typings/julian/julian.d.ts"/>
import { Calendar } from "../init";
import { GregorianCalendar } from "../gregorian";

// Set up the Julian date
function getJulian(year: number, month: number, day: number): number {
    // Figure out the data using the formula from Wikipedia.
    var a = Math.floor((14 - month) / 12);
    var y = year + 4800 - a;
    var m = month + 12 * a - 3;
    var jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    return jdn - 0.5;

    // This was the original answer, but it is wrong.
    //var date = new Date(Date.UTC(year, month, day));
    //var time = date.getTime();
    //var jd = (time / 86400000) + 2440587.5 - 31;
    //return jd;
}

describe("julian dates", function() {
    it("can get for 1583-01-01", function() {
        var cal = new GregorianCalendar();
        var julian = getJulian(1583, 1, 1);
        expect(julian).toEqual(2299238.5);
    });

    it("can get for 1801-01-01", function() {
        var cal = new GregorianCalendar();
        var julian = getJulian(1801, 1, 1);
        expect(julian).toEqual(2378861.5);
    });

    it("can get for 2001-01-01", function() {
        var cal = new GregorianCalendar();
        var julian = getJulian(2001, 1, 1);
        expect(julian).toEqual(2451910.5);
    });

    it("can get for 2001-02-01", function() {
        var cal = new GregorianCalendar();
        var julian = getJulian(2001, 2, 1);
        expect(julian).toEqual(2451941.5);
    });

    it("can get for 2001-02-02", function() {
        var cal = new GregorianCalendar();
        var julian = getJulian(2001, 2, 2);
        expect(julian).toEqual(2451942.5);
    });

    it("can get for 2001-03-01", function() {
        var cal = new GregorianCalendar();
        var julian = getJulian(2001, 3, 1);
        expect(julian).toEqual(2451969.5);
    });
});

describe("gregorian calendar", function() {
    it("can get components for 2001-01-01", function() {
        var cal = new GregorianCalendar();
        var julian = getJulian(2001, 1, 1);
        var point = cal.getPoint(julian);
        expect(point).toEqual({
            year: 2001,
            century: 20,
            millenniumCentury: 0,
            decade: 200,
            centuryYear: 0,
            decadeYear: 1,
            millennium: 2,
            yearDay: 0,
            yearMonth: 0,
            monthDay: 0
        });
    });

    it("can get components for 2001-01-02", function() {
        var cal = new GregorianCalendar();
        var julian = getJulian(2001, 1, 2);
        var point = cal.getPoint(julian);
        expect(point).toEqual({
            year: 2001,
            century: 20,
            millenniumCentury: 0,
            decade: 200,
            centuryYear: 0,
            decadeYear: 1,
            millennium: 2,
            yearDay: 1,
            yearMonth: 0,
            monthDay: 1
        });
    });

    it("can get components for 2001-02-01", function() {
        var cal = new GregorianCalendar();
        var julian = getJulian(2001, 2, 1);
        var point = cal.getPoint(julian);
        expect(point).toEqual({
            year: 2001,
            century: 20,
            millenniumCentury: 0,
            decade: 200,
            centuryYear: 0,
            decadeYear: 1,
            millennium: 2,
            yearDay: 31,
            yearMonth: 1,
            monthDay: 0
        });
    });

    it("can get components for 2001-02-02", function() {
        var cal = new GregorianCalendar();
        var julian = getJulian(2001, 2, 2);
        var point = cal.getPoint(julian);
        expect(point).toEqual({
            year: 2001,
            century: 20,
            millenniumCentury: 0,
            decade: 200,
            centuryYear: 0,
            decadeYear: 1,
            millennium: 2,
            yearDay: 32,
            yearMonth: 1,
            monthDay: 1
        });
    });

    it("can get components for 2001-03-02", function() {
        var cal = new GregorianCalendar();
        var julian = getJulian(2001, 3, 2);
        var point = cal.getPoint(julian);
        expect(point).toEqual({
            year: 2001,
            century: 20,
            millenniumCentury: 0,
            decade: 200,
            centuryYear: 0,
            decadeYear: 1,
            millennium: 2,
            yearDay: 60,
            yearMonth: 2,
            monthDay: 1
        });
    });

    it("can get components for 2002-02-02", function() {
        var cal = new GregorianCalendar();
        var julian = getJulian(2002, 2, 2);
        var point = cal.getPoint(julian);
        expect(point).toEqual({
            year: 2002,
            century: 20,
            millenniumCentury: 0,
            decade: 200,
            centuryYear: 0,
            decadeYear: 2,
            millennium: 2,
            yearDay: 32,
            yearMonth: 1,
            monthDay: 1
        });
    });

    it("can get components for 2002-03-02", function() {
        var cal = new GregorianCalendar();
        var julian = getJulian(2002, 3, 2);
        var point = cal.getPoint(julian);
        expect(point).toEqual({
            year: 2002,
            century: 20,
            millenniumCentury: 0,
            decade: 200,
            centuryYear: 0,
            decadeYear: 2,
            millennium: 2,
            yearDay: 60,
            yearMonth: 2,
            monthDay: 1
        });
    });

    it("can get components for 2003-02-02", function() {
        var cal = new GregorianCalendar();
        var julian = getJulian(2003, 2, 2);
        var point = cal.getPoint(julian);
        expect(point).toEqual({
            year: 2003,
            century: 20,
            millenniumCentury: 0,
            decade: 200,
            centuryYear: 0,
            decadeYear: 3,
            millennium: 2,
            yearDay: 32,
            yearMonth: 1,
            monthDay: 1
        });
    });

    it("can get components for 2003-03-02", function() {
        var cal = new GregorianCalendar();
        var julian = getJulian(2003, 3, 2);
        var point = cal.getPoint(julian);
        expect(point).toEqual({
            year: 2003,
            century: 20,
            millenniumCentury: 0,
            decade: 200,
            centuryYear: 0,
            decadeYear: 3,
            millennium: 2,
            yearDay: 60,
            yearMonth: 2,
            monthDay: 1
        });
    });

    it("can get components for 2004-02-02", function() {
        var cal = new GregorianCalendar();
        var julian = getJulian(2004, 2, 2);
        var point = cal.getPoint(julian);
        expect(point).toEqual({
            year: 2004,
            century: 20,
            millenniumCentury: 0,
            decade: 200,
            centuryYear: 0,
            decadeYear: 4,
            millennium: 2,
            yearDay: 32,
            yearMonth: 1,
            monthDay: 1
        });
    });

    it("can get components for 2004-03-02", function() {
        var cal = new GregorianCalendar();
        var julian = getJulian(2004, 3, 2);
        var point = cal.getPoint(julian);
        expect(point).toEqual({
            year: 2004,
            century: 20,
            millenniumCentury: 0,
            decade: 200,
            centuryYear: 0,
            decadeYear: 4,
            millennium: 2,
            yearDay: 61,
            yearMonth: 2,
            monthDay: 1
        });
    });

    it("can get components for 2100-03-02", function() {
        var cal = new GregorianCalendar();
        var julian = getJulian(2100, 3, 2);
        var point = cal.getPoint(julian);
        expect(point).toEqual({
            year: 2100,
            century: 21,
            millenniumCentury: 1,
            decade: 210,
            centuryYear: 0,
            decadeYear: 0,
            millennium: 2,
            yearDay: 60,
            yearMonth: 2,
            monthDay: 1
        });
    });

    it("can get components for 2101-03-02", function() {
        var cal = new GregorianCalendar();
        var julian = getJulian(2101, 3, 2);
        var point = cal.getPoint(julian);
        expect(point).toEqual({
            year: 2101,
            century: 21,
            millenniumCentury: 1,
            decade: 210,
            centuryYear: 0,
            decadeYear: 1,
            millennium: 2,
            yearDay: 60,
            yearMonth: 2,
            monthDay: 1
        });
    });
});
