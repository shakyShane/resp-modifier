var express = require("express");
var assert = require("chai").assert;
var request = require("supertest");
var overwrite = require("../lib/utils").overwriteBody;


describe("Controlling regex replacements", function () {
    var res;
    beforeEach(function () {
        res = {
            rulesWritten: []
        };
    });
    it("should allow simple string replacements", function () {
        var actual = overwrite([
            {
                match: "{name}",
                replace: "shane"
            },
            {
                match: "{greeting}",
                replace: "Welcome to New York"
            }
        ], "hello {name} - {greeting}", res);

        var expected = "hello shane - Welcome to New York";

        assert.equal(actual, expected);
    });
    it("should allow regex replacements", function () {
        var actual = overwrite([
            {
                match: "{name}",
                replace: "shane"
            },
            {
                match: /(style\.)(.+?)(\.css)/,
                fn: function () {
                    return arguments[1] + "min" + arguments[3];
                }
            }
        ], "<link href=\"assets/style.463463456.css\" />", res);

        var expected = "<link href=\"assets/style.min.css\" />";

        assert.equal(actual, expected);
    });
    it("should handle complex string replacements", function () {
        var input = "<link href=\"https://assets-cdn.github.com/assets/github/index-603a3bfa01049c9ed5537543ad3934c6fd83c6606b38df5bf2ef436ee93a88e8.css\" media=\"all\" rel=\"stylesheet\" />" +
            "<link href=\"https://assets-cdn.github.com/assets/github2/index-4190b0977b9e2166bf19e2cef0c628ba77d6deaf2dda51987b61c5f58e96e255.css\" media=\"all\" rel=\"stylesheet\" />";

        var expected = "<link href=\"/assets/core.css\" media=\"all\" rel=\"stylesheet\" />" +
            "<link href=\"/assets/core2.css\" media=\"all\" rel=\"stylesheet\" />";

        var actual = overwrite([
            {
                match: "https://assets-cdn.github.com/assets/github/index-603a3bfa01049c9ed5537543ad3934c6fd83c6606b38df5bf2ef436ee93a88e8.css",
                replace: "/assets/core.css"
            },
            {
                match: "https://assets-cdn.github.com/assets/github2/index-4190b0977b9e2166bf19e2cef0c628ba77d6deaf2dda51987b61c5f58e96e255.css",
                replace: "/assets/core2.css"
            }
        ], input, res);

        assert.equal(actual, expected);
    });
    it("should handle complex string + regex replacements", function () {
        var input = "<link href=\"https://assets-cdn.github.com/assets/github/index-603a3bfa01049c9ed5537543ad3934c6fd83c6606b38df5bf2ef436ee93a88e8.css\" media=\"all\" rel=\"stylesheet\" />" +
            "<link href=\"https://assets-cdn.github.com/assets/github2/index-4190b0977b9e2166bf19e2cef0c628ba77d6deaf2dda51987b61c5f58e96e255.css\" media=\"all\" rel=\"stylesheet\" />";

        var expected = "<link href=\"/assets/core.css\" media=\"all\" rel=\"stylesheet\" />" +
            "<link href=\"/assets/core2.css\" media=\"all\" rel=\"stylesheet\" />";

        var actual = overwrite([
            {
                match: new RegExp("https://assets-cdn.github.com(.+?)(?=\")"),
                replace: "/assets/core.css"
            },
            {
                match: "https://assets-cdn.github.com/assets/github2/index-4190b0977b9e2166bf19e2cef0c628ba77d6deaf2dda51987b61c5f58e96e255.css",
                replace: "/assets/core2.css"
            }
        ], input, res);

        assert.equal(actual, expected);
    });
});
