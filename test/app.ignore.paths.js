var multiline = require("multiline");
var express = require("express");
var assert = require("chai").assert;
var app = express();

// run the tests
var request = require("supertest");

var livereload = require("../index.js");

app.use(livereload({
    rules: [
        {
            match: /IGNORE/,
            fn: function (w) {
                return "TEST";
            }
        }
    ],
    ignore: [".woff", ".flv"],
    ignorePaths: ["templates/*.html"]
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

// start the server
if (!module.parent) {
    var port = settings.webserver.port || 3000;
    app.listen(port);
    console.log("Express app started on port " + port);
}

describe("GET /templates/ignore-path.html", function () {
    it("Always allows indexs ", function (done) {
        request(app)
            .get("/")
            .set("Accept", "text/html")
            .expect(200)
            .end(function (err, res) {
                console.log(res.text);
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