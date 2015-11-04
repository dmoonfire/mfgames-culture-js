/// <reference path="../../typings/jasmine/jasmine.d.ts"/>
/// <reference path="./helper.ts"/>
import { Calendar, Culture } from "../init";
import { getJulian, getCalendar, getCulture } from "./helper";

describe("gregorian format", function() {
    it("can format 2001-01-01 as MM/YY/DDDD", function(done) {
        getCulture("en-US").then(
            function(culture: Culture) {
                console.log("got a culture", culture);
                var julian = getJulian(2001, 1, 1);
                var calendar = culture.calendar;
                expect(calendar).toBeDefined();

                var instant = calendar.getInstant(julian);
                var formattedInstant = culture.formatInstant(instant, "MM/DD/YYYY");
                expect(formattedInstant).toEqual(instant, "01/01/2001");
                done();
            },
            function(error) {
                throw error;
            });
    });
});
