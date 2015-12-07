/// <reference path="../../typings/jasmine/jasmine.d.ts"/>
/// <reference path="./helper.ts"/>
import { Calendar, Culture } from "../init";
import { getJulian, getCalendar, getCulture } from "./helper";

describe("round trip formatting", function() {
    it("2015-01-02 13:14:15", function(done) {
        getCulture("nonfiction/en-US").then(
            function(culture: Culture) {
                try {
                    var instant = culture.parseInstant("2015-01-02 13:14:15");
                    var format = culture.formatInstant(instant, "YYYY-MM-DD HH:mm:ss");
                    expect(format).toEqual("2015-01-02 13:14:15");
                    done();
                } catch (exception) {
                    done(exception);
                }
            },
            function(error) { done(error); });
    });

    it("2015-01-02 13:14:14", function(done) {
        getCulture("nonfiction/en-US").then(
            function(culture: Culture) {
                try {
                    var instant = culture.parseInstant("2015-01-02 13:14:14");
                    var format = culture.formatInstant(instant, "YYYY-MM-DD HH:mm:ss");
                    expect(format).toEqual("2015-01-02 13:14:14");
                    done();
                } catch (exception) {
                    done(exception);
                }
            },
            function(error) { done(error); });
    });

    it("2015-01-02 13:14:13", function(done) {
        getCulture("nonfiction/en-US").then(
            function(culture: Culture) {
                try {
                    var instant = culture.parseInstant("2015-01-02 13:14:13");
                    var format = culture.formatInstant(instant, "YYYY-MM-DD HH:mm:ss");
                    expect(format).toEqual("2015-01-02 13:14:13");
                    done();
                } catch (exception) {
                    done(exception);
                }
            },
            function(error) { done(error); });
    });

    it("2015-01-02 13:14:12", function(done) {
        getCulture("nonfiction/en-US").then(
            function(culture: Culture) {
                try {
                    var instant = culture.parseInstant("2015-01-02 13:14:12");
                    var format = culture.formatInstant(instant, "YYYY-MM-DD HH:mm:ss");
                    expect(format).toEqual("2015-01-02 13:14:12");
                    done();
                } catch (exception) {
                    done(exception);
                }
            },
            function(error) { done(error); });
    });

    it("2015-01-02 13:14:11", function(done) {
        getCulture("nonfiction/en-US").then(
            function(culture: Culture) {
                try {
                    var instant = culture.parseInstant("2015-01-02 13:14:11");
                    var format = culture.formatInstant(instant, "YYYY-MM-DD HH:mm:ss");
                    expect(format).toEqual("2015-01-02 13:14:11");
                    done();
                } catch (exception) {
                    done(exception);
                }
            },
            function(error) { done(error); });
    });
});
