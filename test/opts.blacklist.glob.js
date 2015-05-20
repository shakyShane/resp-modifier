var multiline = require("multiline");
var express = require("express");
var assert = require("chai").assert;
var request = require("supertest");
var livereload = require("..");

var output = '<!doctype html><html lang="en-US"><head><meta charset="UTF-8"><title></title></head><body>IGNORE</body></html>';

describe("Black listing glob matches", function () {

    var app, routes, expected, blacklist;

    before(function () {

        app = express();

        routes    = ["/index.html", "/path/path/index.html", "/path/path", "/"];
        blacklist = ["**/*.html"];

        app.use(livereload({
            rules: [
                {
                    match: /IGNORE/,
                    fn: function (w) {
                        return "TEST";
                    }
                }
            ],
            blacklist: blacklist
        }));

        expected = output.replace('IGNORE', 'TEST');

        routes.forEach(function (route) {
            app.get(route, function (req, res) {
                res.end(output);
            });
        });
    });
    it("should not allow /index.html", function (done) {
        request(app)
            .get(routes[0])
            .set("Accept", "text/html")
            .expect(200, output, done);
    });
    it("Should not allow /path/path/index.html", function (done) {
        request(app)
            .get(routes[1])
            .set("Accept", "text/html")
            .expect(200, output, done);
    });
    it("SHOULD allow path with no extension", function (done) {
        request(app)
            .get(routes[2])
            .set("Accept", "text/html")
            .expect(200, expected, done);
    });
    it("SHOULD allow path with /", function (done) {
        request(app)
            .get(routes[3])
            .set("Accept", "text/html")
            .expect(200, expected, done);
    });
});
