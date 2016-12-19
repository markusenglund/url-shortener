//Make a random short URL for every /new/url, make sure shorturl is not replicated.

const mongoose = require("mongoose");
const shortid = require("shortid");
const fs = require("fs");
const express = require("express");
const app = express();
const schema = require("./schema");
const baseUrl = "https://url-service-yogaboll.herokuapp.com/";
const port = (process.env.PORT || 3000);

//mongoose.connect("mongodb://localhost:27017/urlservice");
mongoose.connect("mongodb://markus:markus@ds021016.mlab.com:21016/url-shortener");


var ShortUrl = mongoose.model("ShortUrl", schema, "shortUrls");

app.get("/", (req, res) => {   
    fs.readFile("./index.html", (err, data) => {
        if (err) {
            console.log(err);
            process.exit(1);
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        res.end();
    });    
});

app.get("/new/:url(*)", (req, res) => {
    //console.log("new/url is activated");
    var shortCode = shortid.generate();
    
    var shortUrl = new ShortUrl({
        _id: shortCode,
        original_url: req.params.url                             
    });
    
    shortUrl.save( (err) => {
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

app.get("/:shortUrl", (req, res) => {
    //console.log("shorturl is activated");
    ShortUrl.findOne({ _id: req.params.shortUrl }, (err, doc) => {
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