var express = require("express");
var fs = require("fs");
var path = require("path");
var serveStatic = require("serve-static");
var request = require("supertest");
var assert = require("assert");

var app = express();

var respMod = require("..");
app.use(respMod({
    rules: [
        {
            match: /<[^>]*>/i,
            fn: function (w) {
                return w + "matcher";
            }
        }
    ]
}));

// load static content before routing takes place
app.use(serveStatic(__dirname + "/fixtures"));

var notModified = ["binary.unknown", "blank.pdf", "client.js", "favicon.ico", "font.ttf", "icons.jpg", "json-masquerading-as.html", "no-ext-json-data", "node.png", "tux.svg"];
var modified = ["static.html", "no-ext-html"];

notModified.forEach(function (file) {
    var orig = fs.readFileSync(path.join("test/fixtures", file));
    describe("GET \"/" + file + "\"", function () {
        it("responds without an inserted script", function (done) {
            request(app)
                .get("/" + file)
                .set("Accept", "text/html")
                .expect(200)
                .parse(function binaryParser(res, callback) {
                    res.setEncoding("binary");
                    res.data = "";
                    res.on("data", function (chunk) {
                        res.data += chunk;
                    });
                    res.on("end", function () {
                        callback(null, new Buffer(res.data, "binary"));
                    });
                })
                .end(function (err, res) {
                    assert(!err);
                    assert.ok(Buffer.isBuffer(res.body));
                    assert.equal(res.body.length, orig.length, "equal length");
                    assert.equal(res.body.toString(), orig.toString(), "equal contents");
                    done();
                });
        });
    });
});

modified.forEach(function (file) {
    var orig = fs.readFileSync(path.join("test/fixtures", file)).toString();
    describe("GET \"/" + file + "\"", function () {
        it("responds with an inserted script", function (done) {
            request(app)
                .get("/" + file)
                .set("Accept", "text/html")
                .expect(200)
                .end(function (err, res) {
                    assert(!err);
                    assert(res.text.length > orig.length, "longer content length");
                    assert.equal(res.text.match(/matcher/).length, 1);
                    done();
                });
        });
    });
});
