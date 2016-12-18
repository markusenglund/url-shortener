//Make a random short URL for every /new/url, make sure shorturl is not replicated.

var mongoose = require("mongoose");
var shortid = require("shortid");
var fs = require("fs");
var express = require("express");
var app = express();
var schema = require("./schema");
var baseUrl = "localhost:3000/";
var port = (process.env.PORT || "3000");

mongoose.connect("mongodb://localhost:27017/urlservice");

var ShortUrl = mongoose.model("ShortUrl", schema, "shortUrls");

app.get("/", function(req, res) {
    
    fs.readFile("./index.html", null, function(err, data) {
        if (err) {
            console.log(err);
            process.exit(1);
        }
        res.writeHead(200, { "Content-Type": "text/html" })
        res.write(data);
        res.end();
    });    
});

app.get("/new/:url(*)", function (req, res) {
    //console.log("new/url is activated");
    var shortCode = shortid.generate();
    
    var shortUrl = new ShortUrl({
        _id: shortCode,
        original_url: req.params.url                             
    });
    
    shortUrl.save(function(err) {
        if (err) {
            if (err.name == "ValidationError") {
                res.json({ error: "Wrong url format, make sure you have a valid protocol and real site."})
            } else {
                console.log(err);
                process.exit(1);
            }
        } else {
            res.json({ 
                short_url: baseUrl + shortCode,
                original_url: req.params.url
            });
        }
    });   
});

app.get("/:shortUrl", function (req, res) {
    //console.log("shorturl is activated");
    ShortUrl.findOne({ _id: req.params.shortUrl }, function(err, doc) {
        if (err) {
            console.log(err);
            process.exit(1);
        }
        if (doc) {
            console.log(doc);
            res.redirect(doc.original_url);
        } else {
            res.json({ error: "Url not in database" })
        }

    });
});
app.listen(port);
console.log("Server is listening")