var express = require("express");
var assert = require("chai").assert;
var request = require("supertest");
var respMod = require("..");

var inputString = "<body>příliš žluťoučký kůň</body>";

describe("Correctly decodes unicode characters split by chunk boundary", function () {

    var app, lr;

    before(function () {

        app = express();

        lr = respMod.create({
            rules: [
                {
                    match: "something",
                    replace: "something else"
                }
            ]
        });

        app.use(lr.middleware);

        app.get("/", function (req, res) {
            var inputBuf = Buffer.from(inputString, "utf8");

            res.write(inputBuf.slice(0, 8)); // split in the middle of ř
            res.end(inputBuf.slice(8));
        });
    });

    it("should correctly handle split unicode character", function (done) {

        request(app)
            .get("/")
            .set("Accept", "text/html")
            .end(function (err, res) {
                assert.equal(res.text, inputString);
                done();
            });
    });
});
