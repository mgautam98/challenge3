var Post                        = require("../models/post"),
    User                        = require("../models/user"),
    Comment                     = require("../models/comment");
    

module.exports = {
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        res.redirect("/login");
    },
    
    PostOwnership: function(req, res, next){
      if(req.isAuthenticated()){
        Post.findById(req.params.id, function(err, post) {
          if(err){
            console.log(err);
          }else{
            if(post.author.id.equals(req.user._id)){
              next();
            }else{
              console.log("You don't own this post");
              res.redirect("/posts/" + req.params.id);
            }
          } 
        });
      }else{
        console.log("You need to be logged in to do that!");
        res.redirect('/login');
      }
    },
    
    CommentOwnership: function(req, res, next){
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, comment) {
            if(err){
                console.log(err);
            }else{
                if(comment.author.id.equals(req.user._id)){
                    next();
                }else{
                    console.log("You don't own this comment");
                    res.redirect("/posts/" + req.params.id);
                }
            }
            });
        }else{
            console.log("You need to be logged in to do that!");
            res.redirect('/login');
        }
    }
};