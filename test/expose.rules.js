var express = require("express");
var assert = require("chai").assert;
var request = require("supertest");
var respMod = require("..");

var output = "<!doctype html><html lang=\"en-US\"><head><meta charset=\"UTF-8\"><title></title></head><body>IGNORE</body></html>";

describe("Exposing rules", function () {

    var app, routes, expected1, expected2, lr;

    before(function () {

        app = express();

        // run the tests
        routes    = ["/templates/ignore-path.html", "/index.html", "/"];

        lr = respMod.create({
            rules: [
                {
                    match: /IGNORE/,
                    fn: "TEST"
                }
            ]
        });

        app.use(lr.middleware);

        expected1 = output.replace("IGNORE", "TEST");
        expected2 = output.replace("IGNORE", "TEST").replace("<body>", "<body class=\"Aww yeah\">");

        routes.forEach(function (route) {
            app.get(route, function (req, res) {
                res.end(output);
            });
        });
    });
    it("should replace once, and then replace with updated rules", function (done) {

        request(app)
            .get(routes[0])
            .set("Accept", "text/html")
            .end(function (err, res) {

                assert.equal(res.text, expected1);

                lr.update("rules", lr.opts.rules.concat({
                    match: "<body>",
                    replace: "<body class=\"Aww yeah\">"
                }));

                request(app)
                    .get(routes[0])
                    .set("Accept", "text/html")
                    .end(function (err, res) {
                        assert.equal(res.text, expected2);
                        done();
                    });

            });
    });
});
