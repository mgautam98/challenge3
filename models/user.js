var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


var UserSchema = new mongoose.Schema({
    username: { type: String, require: true, unique: true },
    email: { type: String, require: true },
    password: String,
    avatar: String,
    about: String,
    friends: [{
         type: mongoose.Schema.Types.ObjectId,
         ref:"User"
      }],
    posts: [
        {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Post"
        }
    ],
    votes: Number
});

UserSchema.methods.vote = function(){
   this.votes++;
   return this.save();
};


UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);