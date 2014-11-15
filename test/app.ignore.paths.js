var express = require("express");
var assert = require("chai").assert;
var app = express();

// run the tests
var request = require("supertest");

app.use(express.bodyParser());
app.use(express.methodOverride());

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

app.get("/templates/ignore-path.html", function (req, res) {
    res.end("<!doctype html>\n<html lang=\"en-US\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title></title>\n</head>\n<body>\n    IGNORE\n</body>\n</html>")
});

// start the server
if (!module.parent) {
    var port = settings.webserver.port || 3000;
    app.listen(port);
    console.log("Express app started on port " + port);
}

describe("GET /templates/ignore-path.html", function () {
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