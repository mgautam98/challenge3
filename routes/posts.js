var express = require('express'),
    router = express.Router(),
    middleware = require("../middleware"),
    Post = require("../models/post"),
    User = require("../models/user");


// ==================POSTS===============================
router.get('/posts', function(req, res) {
    Post.find({}).populate("author.id").exec(function(err, posts) {
        if (err) {
            console.log(err);
        } else {
            res.render("posts/index", {
                posts: posts
            });
        }
    });
});

//this gets the form which creates new post
router.get('/posts/new', middleware.isLoggedIn, function(req, res) {
    res.render("posts/new");
});

//new post logic
router.post('/posts', middleware.isLoggedIn, function(req, res) {
    var title = req.body.title;
    var body = req.body.body;
    var meta = {
        votes: 0,
        favs: 0,
    };

    var newPost = {
        title: title,
        body: body,
        meta: meta,
        hidden: false
    };

    User.findById(req.user._id, function(err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            Post.create(newPost, function(err, newPost) {
                if (err) {
                    console.log(err);
                } else {
                    newPost.author.id = req.user._id;
                    newPost.author.username = req.user.username;
                    newPost.save();
                    foundUser.posts.push(newPost);
                    foundUser.save();
                    res.redirect('/posts/' + newPost.id);
                }
            });
        }
    });
});


//show the posts
router.get('/posts/:id', function(req, res) {
    Post.findById(req.params.id).populate('author.id').populate({
        path: 'comments',
        populate: {
            path: 'author.id'
        }
    }).exec(function(err, foundPost) {
        if (err) {
            res.redirect("/");
        } else {
            res.render("posts/show", {
                post: foundPost
            });
        }
    });
});

router.get('/posts/:id/edit', middleware.PostOwnership, function(req, res) {
    Post.findById(req.params.id, function(err, foundPost) {
        if (err) {
            res.redirect("/");
        } else {
            res.render("posts/edit", {
                post: foundPost
            });
        }
    });
});

router.put('/posts/:id', function(req, res) {
    Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, UpdatedPost) {
        if (err) {
            res.redirect('/');
        } else {
            res.redirect('/posts/' + req.params.id);
        }
    });
});

router.delete('/posts/:id', middleware.PostOwnership, function(req, res) {
    Post.findByIdAndDelete(req.params.id, function(err) {
        if (err) {
            console.log(err);
            res.redirect("/posts");
        } else {
            res.redirect("/posts");
        }
    });
});




module.exports = router;