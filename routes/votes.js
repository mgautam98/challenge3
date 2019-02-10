var express                     = require('express'),
    router                      = express.Router(),
    middleware                  = require("../middleware"),
    Post                        = require("../models/post"),
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
          foundPost.vote();
          // foundUser.vote();
          res.redirect("back");
        }
       });
     }
   });
});
   
    
    
module.exports = router;