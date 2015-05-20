var multiline = require("multiline");
var express = require("express");
var assert = require("chai").assert;
var request = require("supertest");
var livereload = require("..");

var output = '<!doctype html><html lang="en-US"><head><meta charset="UTF-8"><title></title></head><body>IGNORE</body></html>';

describe("Black listing exact matches", function () {

    var app, routes, expected;

    before(function () {

        app = express();

        // run the tests
        routes   = ["/templates/ignore-path.html", "/", "/shane"];

        app.use(livereload({
            rules: [
                {
                    match: /IGNORE/,
                    fn: function (w) {
                        return "TEST";
                    }
                }
            ],
            blacklist: routes
        }));

        expected = output.replace('IGNORE', 'TEST');

        routes.forEach(function (route) {
            app.get(route, function (req, res) {
                res.end(output);
            });
        });
    });
    it("should not allow a long path", function (done) {
        request(app)
            .get(routes[0])
            .set("Accept", "text/html")
            .expect(200, output, done);
    });
    it("should not allow single slash (homepage)", function (done) {
        request(app)
            .get(routes[1])
            .set("Accept", "text/html")
            .expect(200, output, done);
    });
    it("should not allow a path", function (done) {
        request(app)
            .get(routes[2])
            .set("Accept", "text/html")
            .expect(200, output, done);
    });
});
