var express = require("express");
var assert = require("chai").assert;
var request = require("supertest");
var livereload = require("..");

var output = "<!doctype html><html lang=\"en-US\"><head><meta charset=\"UTF-8\"><title></title></head><body>IGNORE</body></html>";

describe("Exposing and updating the blacklist", function () {

    var app, routes, expected, lr;

    before(function () {

        app = express();

        // run the tests
        routes    = ["/templates/ignore-path.html", "/index.html", "/"];

        lr = livereload.create({
            rules: [
                {
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
    it("should initially allow all routes, but then ban one when added to the blacklist", function (done) {
        request(app)
            .get(routes[0])
            .set("Accept", "text/html")
            .end(function (err, res) {

                assert.equal(res.text, expected);

                lr.opts.blacklist.push(routes[0]);

                request(app)
                    .get(routes[0])
                    .set("Accept", "text/html")
                    .end(function (err, res) {
                        assert.equal(res.text, output);
                        done();
                    });
            });
    });
});
