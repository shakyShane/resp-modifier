var express = require("express");
var assert = require("chai").assert;
var request = require("supertest");
var respMod = require("..");

var output = "jQuery.ajax({" +
    "url: paths.url" +
    "})";

describe("Example of overwriting a JS file", function () {

    var app, routes, lr;

    before(function () {

        app = express();

        // run the tests
        routes = ["/js/app.js"];

        lr = respMod.create({
            rules: [
                {
                    paths: ["**/*.js"],
                    match: "url: paths.url",
                    replace: "url: paths.url + '?rel=' + new Date().getTime()",
                }
            ]
        });

        app.use(lr.middleware);

        routes.forEach(function (route) {
            app.get(route, function (req, res) {
                res.end(output);
            });
        });
    });
    it("should overwrite a JS file", function (done) {
        request(app)
            .get(routes[0])
            .set("Accept", "text/html")
            .end(function (err, res) {
                assert.equal(res.text, "jQuery.ajax({url: paths.url + '?rel=' + new Date().getTime()})");
                done();
            });
    });
});
