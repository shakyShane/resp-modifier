var multiline = require("multiline");
var express   = require("express");
var assert    = require("chai").assert;
var app       = express();
var request   = require("supertest");
var respMod   = require("..");

app.use(respMod({
    rules: [
        {
            match: /INCLUDE/,
            fn: function (w) {
                return "TEST";
            }
        }
    ],
    whitelist: ["/"]
}));

var output = multiline(function () {/*
<!doctype html>
<html lang="en-US">
<head>
    <meta charset="UTF-8">
    <title></title>
</head>
<body>
    INCLUDE
</body>
</html>
*/});

var expected = output.replace("INCLUDE", "TEST");

app.get("/", function (req, res) {
    res.end(output);
});
app.get("/app/index.html", function (req, res) {
    res.end(output);
});
app.get("/app/some/other/dir/but/a/match/still/index.html", function (req, res) {
    res.end(output);
});
app.get("/templates/home.html", function (req, res) {
    res.end(output);
});

describe("Only using included paths", function () {
    it("respond with inserted script", function (done) {
        request(app)
            .get("/app/index.html")
            .set("Accept", "text/html")
            .expect(200, expected, done);
    });
    it("respond with inserted script", function (done) {
        request(app)
            .get("/app/some/other/dir/but/a/match/still/index.html")
            .set("Accept", "text/html")
            .expect(200, expected, done);
    });
    it("respond with inserted script", function (done) {
        request(app)
            .get("/templates/home.html")
            .set("Accept", "text/html")
            .expect(200, expected, done);
    });
});
