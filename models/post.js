var mongoose = require("mongoose");


var PostSchema = new mongoose.Schema({
    title: String,
    body: String,
    author: {
      id:{
         type: mongoose.Schema.Types.ObjectId,
         ref:"User"
      },
      username:String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ],
   hidden: Boolean,
   meta: {
      votes: Number,
      favs:  Number
    }
});


module.exports = mongoose.model("Post", PostSchema);