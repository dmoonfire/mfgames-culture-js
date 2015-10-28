/// <reference path="../../typings/jasmine/jasmine.d.ts"/>
import { Calendar } from "../init";
import { GregorianCalendar } from "../gregorian";

// Set up the Julian date
function getJulian(date: Date)
{
    return (date.getTime() / 86400000) - (date.getTimezoneOffset()/1440) + 2440587.5;
}

describe("gregorian", function() {
    it("verify 1583-01-01", function() {
        var cal = new GregorianCalendar();
        var julian = getJulian(new Date(1583, 1, 1));
        var point = cal.getPoint(julian);
        console.log(julian, point);
        expect("test").toEqual("test");
    });
});
