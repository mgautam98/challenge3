var express                     = require('express'),
    router                      = express.Router(),
    middleware                  = require("../middleware"),
    Post                        = require("../models/post"),
    Comment                     = require("../models/comment"),
    User                        = require("../models/user");
    

// ====================Friends==================================

router.get('/users/:id/friends', middleware.isLoggedIn, function(req, res) {
  User.findById(req.params.id).populate("friends").exec(function(err, foundUser){
    if(err){
      res.redirect("/");
    } else{
      res.render("friends/index", {user:foundUser});
    }
  });
});

router.post('/users/:id/friends', middleware.isLoggedIn, function(req, res) {
  User.findById(req.params.id, function(err, foundUser1) {
    if(err){
      console.log(err);
    } else {
      User.findById(req.user._id, function(err, foundUser2) {
        if(err){
          console.log(err);
        } else {
          foundUser1.friends.push(foundUser2);
          foundUser2.friends.push(foundUser1);
          foundUser1.save();
          foundUser2.save();
          res.redirect("back");
        }
      });
    }
  });
});

//remove a friend
router.delete('/users/:id/friends/:friend_id', middleware.isLoggedIn, function(req, res){
  // User.findByIdAndRemove(req.params.friend_id, function(err, foundFriend){
  //   if(err) {
  //     console.log(err);
  //   } else {
  //     res.redirect("back");
  //   }
  // });
  res.redirect("back");
});

    

    
module.exports = router;