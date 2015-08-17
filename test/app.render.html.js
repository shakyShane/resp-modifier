var express = require("express");
var serveStatic = require("serve-static");

var app = express();
var matched = false;
// load liveReload script only in development mode
if (app.get("env") === "development") {
    // live reload script
    var respMod = require("..");
    app.use(respMod({
        rules: [
            {
                match: /https\:\/\/web-vip\.selcobw\.com/g,
                fn: function () {
                    return "SHANE";
                }
            },
            {
                match: /<body[^>]*>/i,
                fn: function (match) {
                    return arguments[0] + "<<SHANE";
                },
                once: true
            }
        ]
    }));
}

// load static content before routing takes place
app.use(serveStatic(__dirname + "/fixtures"));

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
            .get("/multi.html")
            .set("Accept", "text/html")
            .expect(200)
            .end(function (err, res) {
                var count1 = 0;
                var count2 = 0;

                res.text.replace(/<<SHANE/g, function () {
                    count1 += 1;
                });

                res.text.replace(/SHANE/g, function () {
                    count2 += 1;
                });

                assert.equal(count1, 1);
                assert.equal(count2, 150);

                done();
            });
    });
});