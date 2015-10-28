/// <reference path="../../typings/jasmine/jasmine.d.ts"/>
/// <reference path="../init.ts"/>

import * as calendar from "../init";

describe("gregorian", function() {
    it("can create", function () {
        console.log(calendar);
        expect("test").toEqual("test");
    });
});
