var express = require("express");
var assert = require("chai").assert;
var request = require("supertest");
var respMod = require("..");

var output = "<!doctype html><html lang=\"en-US\"><head><meta charset=\"UTF-8\"><title></title></head><body>IGNORE</body></html>";

describe("Adding rules with single paths only", function () {

    var app, routes, expected, lr;

    before(function () {

        app = express();

        // run the tests
        routes = ["/index2.html"];

        lr = respMod.create({
            rules:     [
                {
                    paths: ["/index.html"],
                    match: /IGNORE/,
                    fn: function (w) {
                        return "TEST";
                    }
                }
            ]
        });

        app.use(lr.middleware);

        expected = output.replace("IGNORE", "TEST");

        routes.forEach(function (route) {
            app.get(route, function (req, res) {
                res.end(output);
            });
        });
    });
    it("should not overwrite when a single path given", function (done) {
        request(app)
            .get(routes[0])
            .set("Accept", "text/html")
            .end(function (err, res) {
                assert.equal(res.text, output);
                done();
            });
    });
});
