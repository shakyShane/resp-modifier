var express = require("express");
var fs = require("fs");
var serveStatic = require("serve-static");
var respMod = require("..");
var app = express();
var matcher = "resp-mod-tested";
var request = require("supertest");
var assert = require("assert");

app.use(respMod({
    rules: [
        {
            match: /resp-mod/,
            fn: function (req, res, w) {
                return w + "-tested";
            }
        }
    ],
    ignore: [".woff", ".flv"]
}));

// live reload script
app.use(respMod({
    port: 35731,
    ignore: [".hammel"]
}));

// load static content before routing takes place
app.use(serveStatic(__dirname + "/fixtures"));

app.get("/stream", function (req, res) {
    var stream = fs.createReadStream(__dirname + "/fixtures/large-file.html");
    stream.pipe(res);
});

describe("GET /stream", function () {
    it("respond with inserted script", function (done) {
        request(app)
            .get("/stream")
            .set("Accept", "text/html")
            .expect(200)
            .end(function (err, res) {
                assert(res.text.indexOf(matcher) > 1);
                if (err) {
                    return done(err);
                }
                done();
            });
    });
});
