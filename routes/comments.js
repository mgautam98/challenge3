var express = require('express'),
    router = express.Router(),
    middleware = require("../middleware"),
    Post = require("../models/post"),
    Comment = require("../models/comment"),
    User = require("../models/user");


// ====================COMMENTS==================================

router.get('/posts/:id/comments/new', middleware.isLoggedIn, function(req, res) {
    Post.findById(req.params.id, function(err, foundPost) {
        if (err) {
            res.redirect("/");
        } else {
            res.render("comments/new", {
                post: foundPost
            });
        }
    });
});

router.post("/posts/:id/comments", middleware.isLoggedIn, function(req, res) {
    Post.findById(req.params.id, function(err, foundPost) {
        if (err) {
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;

                    comment.save();
                    foundPost.comments.push(comment);
                    foundPost.save();
                    res.redirect("/posts/" + foundPost._id);
                }
            });
        }
    });
});


router.get('/posts/:id/comments/:comment_id/edit', middleware.CommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/edit', {
                post_id: req.params.id,
                comment: foundComment
            });
        }
    });
});

router.put('/posts/:id/comments/:comment_id', middleware.isLoggedIn, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, UpdatedComment) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/posts/" + req.params.id);
        }
    });
});

router.delete('/posts/:id/comments/:comment_id', middleware.CommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err, foundComment) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("back");
        }
    });
});




module.exports = router;