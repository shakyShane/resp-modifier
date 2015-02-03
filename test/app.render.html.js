var express = require("express");
var serveStatic = require("serve-static");

var app = express();

// load liveReload script only in development mode
if (app.get("env") === "development") {
    // live reload script
    var livereload = require("..");
    app.use(livereload({
        rules: [
            {
                match: /html5/,
                fn: function () {
                    return "matcher";
                }
            }
        ]
    }));
}

// load static content before routing takes place
app.use(serveStatic(__dirname + "/fixtures"));

app.get("/dummies", function (req, res) {
    var html = "<!DOCTYPE html> html5 for dummies";
    res.send(html);
});

app.get("/doctype", function (req, res) {
    var html = "<!DOCTYPE html> html5 rocks... <script> console.log('dok'); </script> !!";
    res.send(html);
});

app.get("/html", function (req, res) {
    var html = "<html><title>html5 without body </title></html>";
    res.send(html);
});

app.get("/head", function (req, res) {
    var html = "<head><title>html5 without body </title></head>";
    res.send(html);
});


// start the server
if (!module.parent) {
    var port = settings.webserver.port || 3000;
    app.listen(port);
    console.log("Express app started on port " + port);
}

// run the tests
var request = require("supertest");
var assert = require("assert");

describe("GET /dummies", function () {
    it("respond with inserted script", function (done) {
        request(app)
            .get("/dummies")
            .set("Accept", "text/html")
            .expect(200)
            .end(function (err, res) {
                assert.equal(res.text.match(/matcher/).length, 1);
                if (err) {
                    return done(err);
                }
                done();
            });
    });
});

describe("GET /doctype", function () {
    it("respond with inserted script", function (done) {
        request(app)
            .get("/doctype")
            .set("Accept", "text/html")
            .expect(200)
            .end(function (err, res) {
                assert.equal(res.text.match(/matcher/).length, 1);
                if (err) {
                    return done(err);
                }
                done();
            });
    });
});

describe("GET /html", function () {
    it("respond with inserted script", function (done) {
        request(app)
            .get("/html")
            .set("Accept", "text/html")
            .expect(200)
            .end(function (err, res) {
                assert.equal(res.text.match(/matcher/).length, 1);
                if (err) {
                    return done(err);
                }
                done();
            });
    });
});
