var express                     = require('express'),
    router                      = express.Router(),
    middleware                  = require("../middleware"),
    Post                        = require("../models/post"),
    Comment                     = require("../models/comment"),
    User                        = require("../models/user");
    
    
router.get('/users/:id', function(req, res) {
    User.findById(req.params.id).populate("posts votes").exec(function(err, foundUser){
        if(err){
            res.redirect("/");
        } else{
            res.render("users/index", {user:foundUser});
        }
    });
});

router.get('/users/:id/edit', middleware.isLoggedIn, function(req, res) {
  User.findById(req.params.id, function(err, foundUser) {
      if(err){
        console.log(err);
      } else {
        res.render('users/edit', {user:foundUser});
      }
  });
});


router.put('/users/:id', middleware.isLoggedIn, function(req, res){
  User.findById(req.params.id, function(err, foundUser) {
    if(err){
      console.log(err);
    }else{
      
      // Changing username will result in loss
      // of data (previous posts) and various problems
      
      foundUser.UpdateInfo(req.body.email, req.body.username, req.body.about, req.body.avatar);
      res.redirect("/users/" + req.params.id);
    }
  });
});

    
    
    
    
module.exports = router;