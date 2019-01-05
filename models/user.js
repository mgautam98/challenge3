var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


var UserSchema = new mongoose.Schema({
    username: { type: String, require: true, unique: true },
    email: { type: String, require: true },
    password: String,
    avatar: String,
    votes: Number,
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
    ]
});

UserSchema.methods.vote = function(){
   this.votes++;
   return this.save();
};

UserSchema.methods.UpdateInfo = function(email, username, about, avatar){
    this.email = email;
    this.username = username;
    this.about = about;
    this.avatar = avatar;
    return this.save();
};

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);