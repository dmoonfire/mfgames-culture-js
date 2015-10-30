/// <reference path="../../typings/jasmine/jasmine.d.ts"/>
/// <reference path="./helper.ts"/>
import { Calendar } from "../init";
import { getJulian, getCalendar, failTest } from "./helper";

describe("gregorian calendar", function() {
    it("can get components for 2001-01-01", function(done) {
        getCalendar().then(function(cal: Calendar) {
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
            done();
        });
    });

    it("can get components for 2001-01-02", function(done) {
        getCalendar().then(function(cal) {
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
            done();
        });
    });

    it("can get components for 2001-02-01", function(done) {
        getCalendar().then(function(cal) {
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
            done();
        });
    });

    it("can get components for 2001-02-02", function(done) {
        getCalendar().then(function(cal) {
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
            done();
        });
    });

    it("can get components for 2001-03-02", function(done) {
        getCalendar().then(function(cal) {
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
            done();
        });
    });

    it("can get components for 2002-02-02", function(done) {
        getCalendar().then(function(cal) {
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
            done();
        });
    });

    it("can get components for 2002-03-02", function(done) {
        getCalendar().then(function(cal) {
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
            done();
        });
    });

    it("can get components for 2003-02-02", function(done) {
        getCalendar().then(function(cal) {
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
            done();
        });
    });

    it("can get components for 2003-03-02", function(done) {
        getCalendar().then(function(cal) {
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
            done();
        });
    });

    it("can get components for 2004-02-02", function(done) {
        getCalendar().then(function(cal) {
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
            done();
        });
    });

    it("can get components for 2004-03-02", function(done) {
        getCalendar().then(function(cal) {
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
            done();
        });
    });

    it("can get components for 2100-03-02", function(done) {
        getCalendar().then(function(cal) {
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
            done();
        });
    });

    it("can get components for 2101-03-02", function(done) {
        getCalendar().then(function(cal) {
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
            done();
        });
    });
});
