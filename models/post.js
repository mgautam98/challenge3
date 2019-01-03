var mongoose = require("mongoose");


let PostSchema = new mongoose.Schema({
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
    },
   created: {type:Date, Default:Date.now}
});

PostSchema.methods.vote = function(){
   this.meta.votes++;
   return this.save();
};


module.exports = mongoose.model("Post", PostSchema);