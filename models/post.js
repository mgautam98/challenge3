var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


var PostSchema = new mongoose.Schema({
    title: String,
    body: String,
    author: String,
    comments: [{ body: String, date: Date }],
    created: {type:Date, Default:Date.now},
    hidden: Boolean,
    meta: {
      votes: Number,
      favs:  Number
    }
});


PostSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Post", PostSchema);