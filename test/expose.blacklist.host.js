var express = require("express");
var assert = require("chai").assert;
var request = require("supertest");
var respMod = require("..");

var output = "<!doctype html><html lang=\"en-US\"><head><meta charset=\"UTF-8\"><title></title></head><body>IGNORE</body></html>";

describe("Exposing and updating the blacklisted hosts", function () {

    var app, routes, expected, lr, port, host;

    before(function () {

        app = express();

        routes    = ["/templates/ignore-path.html", "/index.html", "/"];

        lr = respMod.create({
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

        var server = app.listen();
        port = server.address().port;
        host = ['127.0.0.1', port].join(':');

        expected = output.replace("IGNORE", "TEST");

        routes.forEach(function (route) {
            app.get(route, function (req, res) {
                res.end(output);
            });
        });
    });
    it("should initially allow all routes, but then ban one when the host has been added to the blacklist", function (done) {
        request(['http://', host].join(''))
            .get(routes[0])
            .set("Accept", "text/html")
            .end(function (err, res) {

                assert.equal(res.text, expected);

                lr.opts.hostBlacklist.push(host);

                request(['http://', host].join(''))
                    .get(routes[0])
                    .set("Accept", "text/html")
                    .end(function (err, res) {
                        assert.equal(res.text, output); // no longer rewritten
                        done();
                    });
            });
    });
});
