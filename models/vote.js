var mongoose = require("mongoose");

var voteSchema = new mongoose.Schema({
    username: String,
    post: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        },
        title: String
    }
});


module.exports = mongoose.model("Vote", voteSchema);