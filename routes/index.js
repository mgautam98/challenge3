var express                     = require('express'),
    router                      = express.Router(),
    passport                    = require("passport"),
    middleware                  = require("../middleware"),
    Post                        = require("../models/post"),
    Comment                     = require("../models/comment"),
    User                        = require("../models/user");
    
    
    

// ====================AUTHENTICATION=============================
router.get('/register', function(req, res){
  res.render("register");
});

router.post('/register', function(req, res){
  User.register(new User({username:req.body.username, email:req.body.email, avatar: req.body.avatar, about:"Just Joined."}), req.body.password, function(err, user){
    if(err){
      console.log(err);
      return res.render('/register');
    }
    passport.authenticate("local")(req, res, function(){
      res.redirect("/");
    });
  });
});


router.get('/login', function(req, res){
  res.render("login");
});

router.post('/login', passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login"
}), function(req, res){
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect("/");
});  
    
    
    
module.exports = router;