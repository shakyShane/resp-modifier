var express     = require("express");
var serveStatic = require("serve-static");
var request     = require("supertest");
var assert      = require("assert");
var respMod     = require("..");
var app         = express();
var rules = respMod({
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
});

app.use(rules);
app.use(serveStatic(__dirname + "/fixtures"));

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