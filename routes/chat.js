var express = require('express'),
    router = express.Router(),
    User = require("../models/user"),
    middleware = require("../middleware");



// ====================CHAT=============================

router.get('/chat', middleware.isLoggedIn, function(req, res) {
    User.findById(req.user._id, function(err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            res.render('chat', {
                user: foundUser
            });
        }
    });
});



module.exports = router;