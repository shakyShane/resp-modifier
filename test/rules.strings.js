var express = require("express");
var assert = require("chai").assert;
var request = require("supertest");
var respMod = require("..");

var input    = "<!doctype html>\n<html lang=\'en\'>\n<head>\n    <meta charset=\'UTF-8\'>\n    <title>Document</title>\n    <link rel=\'stylesheet\' href=\'http://example.com/css/core.css\'/>\n</head>\n<body>\n\n</body>\n</html>";
var expected = "<!doctype html>\n<html lang=\'en\'>\n<head>\n    <meta charset=\'UTF-8\'>\n    <title>Document</title>\n    <link rel=\'stylesheet\' href=\'/assets/css/core.css\'/>\n</head>\n<body>\n\n</body>\n</html>";

describe("Can rewrite using simple string replacements", function () {

    var app, lr;

    before(function () {

        app = express();

        lr = respMod.create({
            rules: [
                {
                    match: "http://example.com/css/core.css",
                    replace: "/assets/css/core.css"
                }
            ]
        });

        app.use(lr.middleware);

        app.get("/", function (req, res) {
            res.end(input);
        });
    });

    it("should replace 1 string with the other", function (done) {

        request(app)
            .get("/")
            .set("Accept", "text/html")
            .end(function (err, res) {
                assert.equal(res.text, expected);
                done();
            });
    });
});

describe("Can avoid regex-like input by using strings", function () {

    var app, lr;

    before(function () {

        app = express();

        lr = respMod.create({
            rules: [
                {
                    paths: ["/"],
                    match: "define([\"jquery\"]",
                    replace: "define([\"jquery\", \"some-other\"]"
                }
            ]
        });

        app.use(lr.middleware);

        app.get("/", function (req, res) {
            res.end("define([\"jquery\"], function ()");
        });
    });

    it("should replace 1 string with the other", function (done) {

        request(app)
            .get("/")
            .set("Accept", "text/html")
            .end(function (err, res) {
                assert.equal(res.text, "define([\"jquery\", \"some-other\"], function ()");
                done();
            });
    });
});
