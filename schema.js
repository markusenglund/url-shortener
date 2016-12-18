var mongoose = require("mongoose");

var schema = new mongoose.Schema({
    
    _id: {
        type: String,
        required: true
    },
    original_url: {
        type: String,
        required: true,
        match: /^https?:\/\/[0-9a-z]+\.[0-9a-z]/i
    }
});

module.exports = schema;