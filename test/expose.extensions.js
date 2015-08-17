var express = require("express");
var assert = require("chai").assert;
var request = require("supertest");
var respMod = require("..");

var output = "just some string";

describe("Exposing the regex that ignores file types based on ext", function () {

    var app, routes, expected1, lr;

    before(function () {

        app = express();

        // run the tests
        routes    = ["/js/app.js"];

        lr = respMod.create({
            rules: [
                {
                    match: "string",
                    fn: "STRING"
                }
            ]
        });

        app.use(lr.middleware);

        expected1 = output.replace("string", "STRING");

        routes.forEach(function (route) {
            app.get(route, function (req, res) {
                res.end(output);
            });
        });
    });
    it("should not replace a JS file, but then do the replacement with updated whitelist", function (done) {

        request(app)
            .get(routes[0])
            .set("Accept", "text/html")
            .end(function (err, res) {
                assert.equal(res.text, output);

                lr.opts.whitelist.push("**/*.js");

                request(app)
                    .get(routes[0])
                    .set("Accept", "text/html")
                    .end(function (err, res) {
                        assert.equal(res.text, expected1);
                        done();
                    });
            });
    });
});
