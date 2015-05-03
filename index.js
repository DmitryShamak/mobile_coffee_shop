var fs = require("fs");
var express = require("express");
var mime = require("mime");

var app = express();

var port = 10102;

var styleGenerator = require("./assets/js/nodeModules/styleGenerator.js");

app.get("*", function (req, res, next) {
    var url = (req.url == "/") ? "/index.html" : req.url;

    if(url == "/generate_styles") {
        styleGenerator.generate();
        return res.redirect("/");
    }

    if (url.indexOf("http") == -1) {
        url = "." + url;
    }

    fs.readFile(url, function (err, data) {
        if (err) {
            return res.status(404).end("Error");
        }

        res.setHeader("Content-Type", mime.lookup(url));
        res.end(data);
    });
});

app.listen(port, function () {
    console.log("Application available on %d port", port);
});