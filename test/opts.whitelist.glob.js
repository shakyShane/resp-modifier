var multiline = require("multiline");
var express = require("express");
var assert = require("chai").assert;
var request = require("supertest");
var respMod = require("..");

var output = "<!doctype html><html lang=\"en-US\"><head><meta charset=\"UTF-8\"><title></title></head><body>IGNORE</body></html>";

describe("White listing glob matches", function () {

    var app, routes, expected, whitelist, blacklist;

    before(function () {

        app = express();

        // run the tests
        routes    = ["/blog/post/post1.html", "/index.html", "/some/path", "/blog.html"];
        whitelist = ["/blog/**/*.html", "/index.html"];
        blacklist = "**/*.html";

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
            blacklist: blacklist
        }));

        expected = output.replace("IGNORE", "TEST");

        routes.forEach(function (route) {
            app.get(route, function (req, res) {
                res.end(output);
            });
        });
    });
    it("should allow a path blog", function (done) {
        request(app)
            .get(routes[0])
            .set("Accept", "text/html")
            .expect(200, expected, done);
    });
    it("should allow a single exact match", function (done) {
        request(app)
            .get(routes[1])
            .set("Accept", "text/html")
            .expect(200, expected, done);
    });
    it("still work on /some/path because it doesn't match **/*.html", function (done) {
        request(app)
            .get(routes[2])
            .set("Accept", "text/html")
            .expect(200, expected, done);
    });
    it("should not work on /blog.html as it isn't in whitelist but matches the blacklist glob", function (done) {
        request(app)
            .get(routes[3])
            .set("Accept", "text/html")
            .expect(200, output, done);
    });
});
