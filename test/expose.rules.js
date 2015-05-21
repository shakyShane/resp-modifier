var express = require("express");
var assert = require("chai").assert;
var request = require("supertest");
var livereload = require("..");

var output = "<!doctype html><html lang=\"en-US\"><head><meta charset=\"UTF-8\"><title></title></head><body>IGNORE</body></html>";

describe("Exposing rules", function () {

    var app, routes, expected, whitelist;

    before(function () {

        app = express();

        // run the tests
        routes    = ["/templates/ignore-path.html", "/index.html", "/"];
        whitelist = ["/templates/ignore-path.html", "/"];

        var lr = livereload.create({
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
        });

        app.use(lr.middleware);

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
});
