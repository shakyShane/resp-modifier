var connect = require("express");
var respMod = require("./index.js");
var http = require("http");

var app = connect()
    .use(respMod({
        rules: [
            {
                match: /<head[^>]*>/,
                fn: function (w) {
                    return w + "Your string";
                }
            },
            {
                match: 'Shane',
                replace: 'kittie',
                paths: ['/']
            }
        ]
    }))
    .use(connect.static('./'))
    .use('/shane', function (req, res, next) {
        res.setHeader('Content-Type', 'text/html');
        res.end('Shane is the king');
    });

var server = http.createServer(app).listen(8000);

