var multiline = require("multiline");
var express = require("express");
var assert = require("chai").assert;
var request = require("supertest");
var respMod = require("..");

var output = "<!doctype html><html lang=\"en-US\"><head><meta charset=\"UTF-8\"><title></title></head><body>IGNORE</body></html>";

describe("White listing exact matches", function () {

    var app, routes, expected, whitelist;

    before(function () {

        app = express();

        // run the tests
        routes    = ["/templates/ignore-path.html", "/index.html", "/"];
        whitelist = ["/templates/ignore-path.html", "/"];

        app.use(respMod({
            rules: [
                {
                    match: /IGNORE/,
                    fn: function (w) {
                        return "TEST";
                    }
                }
            ],
            whitelist: whitelist,
            blacklist: ["**/*.html"]
        }));

        expected = output.replace("IGNORE", "TEST");

        routes.forEach(function (route) {
            app.get(route, function (req, res) {
                res.end(output);
            });
        });
    });
    it("should allow a slash only", function (done) {
        request(app)
            .get(routes[0])
            .set("Accept", "text/html")
            .expect(200, expected, done);
    });
    it("should not work on index.html because **/*.html in blacklist", function (done) {
        request(app)
            .get(routes[1])
            .set("Accept", "text/html")
            .expect(200, output, done);
    });
    it("still work on / when **/*.html in blacklist", function (done) {
        request(app)
            .get(routes[2])
            .set("Accept", "text/html")
            .expect(200, expected, done);
    });
});
