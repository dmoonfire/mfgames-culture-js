/// <reference path="../../typings/jasmine/jasmine.d.ts"/>
/// <reference path="./helper.ts"/>
import { Calendar, Culture } from "../init";
import { getJulian, getCalendar, getCulture } from "./helper";

describe("gregorian format", function() {
    it("can format 2001-01-01 as MM/YY/DDDD", function(done) {
        getCulture("en-US").then(
            function(culture: Culture) {
                try {
                    var julian = getJulian(2001, 1, 1);
                    var calendar = culture.calendar;
                    expect(calendar).toBeDefined();

                    var instant = calendar.getInstant(julian);
                    var formattedInstant = culture.formatInstant(instant, "MM/DD/YYYY");
                    console.log("instant", formattedInstant);
                    expect(formattedInstant).toEqual(instant, "01/01/2001");
                } catch(err) {
                    fail(err);
                } finally {
                    done();
                }
            },
            function(error) {
                fail("There was an error while running");
            });
    });
});
