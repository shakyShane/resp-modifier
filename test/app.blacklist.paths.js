var multiline = require("multiline");
var express = require("express");
var assert = require("chai").assert;

var app = express();

// run the tests
var request = require("supertest");

var respMod = require("..");

app.use(respMod({
    rules: [
        {
            match: /IGNORE/,
            fn: function (w) {
                return "TEST";
            }
        }
    ],
    blacklist: ["/templates/*.html"]
}));

var output = multiline(function () {/*
<!doctype html>
<html lang="en-US">
<head>
    <meta charset="UTF-8">
    <title></title>
</head>
<body>
    IGNORE
</body>
</html>
*/});
app.get("/templates/ignore-path.html", function (req, res) {
    res.end(output);
});
app.get("/", function (req, res) {
    res.end(output);
});
app.get("/shane", function (req, res) {
    res.end(output);
});

describe("GET /templates/ignore-path.html", function () {
    it("Always allows indexes ", function (done) {
        request(app)
            .get("/")
            .set("Accept", "text/html")
            .expect(200)
            .end(function (err, res) {
                assert.include(res.text, "TEST");
                done();
            });
    });
    it("Always allows nested indexs ", function (done) {
        request(app)
            .get("/shane")
            .set("Accept", "text/html")
            .expect(200)
            .end(function (err, res) {
                assert.include(res.text, "TEST");
                done();
            });
    });
    it("respond with inserted script", function (done) {
        request(app)
            .get("/templates/ignore-path.html")
            .set("Accept", "text/html")
            .expect(200)
            .end(function (err, res) {
                assert.include(res.text, "IGNORE");
                done();
            });
    });
});
