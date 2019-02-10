var express                     = require('express'),
    router                      = express.Router(),
    middleware                  = require("../middleware"),
    Post                        = require("../models/post"),
    Vote                        = require("../models/vote"),
    User                        = require("../models/user");
    
    
// --------------------Likes----------------------
router.post('/posts/:id/vote', middleware.isLoggedIn, function(req, res) {
   Post.findById(req.params.id, function(err, foundPost){
     if(err) console.log(err);
     else{
       User.findById(req.user._id, function(err, foundUser) {
        if(err){
          console.log(err);     
        }else{
            Vote.create(req.user._id, function(err, vote){
                if(err){
                    console.log(err);
                }else{
                    vote.post.id = foundPost._id;
                    foundPost.votes.push(vote);
                    foundPost.save();
                    foundUser.votes.push(vote);
                    foundUser.save();
                    res.redirect("back");      
                }
            })
        }
       });
     }
   });
});
   
    
    
module.exports = router;