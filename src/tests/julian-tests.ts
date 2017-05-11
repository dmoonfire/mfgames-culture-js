const expect = require("expect");
import { getJulian, getCalendar } from "./helper";

describe("julian dates", function() {
    it("can get for 1583-01-01", function() {
        var julian = getJulian(1583, 1, 1);
        expect(julian).toEqual(2299238.5);
    });

    it("can get for 1801-01-01", function() {
        var julian = getJulian(1801, 1, 1);
        expect(julian).toEqual(2378861.5);
    });

    it("can get for 2001-01-01", function() {
        var julian = getJulian(2001, 1, 1);
        expect(julian).toEqual(2451910.5);
    });

    it("can get for 2001-02-01", function() {
        var julian = getJulian(2001, 2, 1);
        expect(julian).toEqual(2451941.5);
    });

    it("can get for 2001-02-02", function() {
        var julian = getJulian(2001, 2, 2);
        expect(julian).toEqual(2451942.5);
    });

    it("can get for 2001-03-01", function() {
        var julian = getJulian(2001, 3, 1);
        expect(julian).toEqual(2451969.5);
    });
});
