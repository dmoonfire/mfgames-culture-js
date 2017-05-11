const expect = require("expect");

describe("environment", function() {
    it("verify test framework", function () {
        expect("test").toEqual("test");
    });
});
