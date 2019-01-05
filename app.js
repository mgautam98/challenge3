var express                     = require('express'),
    mongoose                    = require('mongoose'),
    passport                    = require("passport"),
    bodyParser                  = require("body-parser"),
    User                        = require("./models/user"),
    LocalStrategy               = require("passport-local"),
    passportLocalMongoose       = require("passport-local-mongoose"),
    Post                        = require("./models/post"),
    path                        = require('path'),
    methodOverride              = require("method-override"),
    Comment                     = require("./models/comment");
    
    

//database
mongoose.connect("mongodb://localhost/challenge3");


var app = express();


//setup app
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "The team has no name",
    resave: false,
    saveUninitialized: false
}));
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
//middleware for passing current user to each route
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




// ===================ROUTES===============================

app.get('/', function(req, res) {
   res.redirect('/posts'); 
});

// ==================POSTS===============================
app.get('/posts', function(req, res){
  Post.find({}, function(err, posts){
    if(err){
      console.log(err);
    }else{
      res.render("posts/index", {posts:posts});
    }
  });
});

//this gets the form which creates new post
app.get('/posts/new', isLoggedIn, function(req, res){
  res.render("posts/new");
});

//new post logic
app.post('/posts', function(req, res){
  var title = req.body.title;
  var body = req.body.body;
  var meta = {
    votes: 0,
    favs: 0,
  };
    
  var newPost = {
    title : title,
    body : body,
    meta : meta,
    hidden : false
  };
  
  User.findById(req.user._id, function(err, foundUser) {
    if(err){
      console.log(err);
    } else {
      Post.create(newPost, function(err, newPost) {
          if(err){
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
app.get('/posts/:id', function(req, res) {
    Post.findById(req.params.id).populate("comments").exec(function(err, foundPost){
        if(err){
            res.redirect("/");
        } else{
            res.render("posts/show", {post:foundPost});
        }
    });
});

app.get('/posts/:id/edit', function(req, res) {
  Post.findById(req.params.id, function(err, foundPost){
      if(err){
          res.redirect("/");
      } else{
          res.render("posts/edit", {post:foundPost});
      }
  });
});

app.put('/posts/:id', function(req, res){
  Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, UpdatedPost){
    if(err){
      res.redirect('/');
    } else {
      res.redirect('/posts/' + req.params.id);
    }
  });
});

app.delete('/posts/:id', function(req, res){
  Post.findByIdAndDelete(req.params.id, function(err){
    if(err){
      console.log(err);
      res.redirect("/posts");
    }else{
      res.redirect("/posts");
    }
  });
});

// --------------------Likes----------------------
app.post('/posts/:id/vote', isLoggedIn, function(req, res) {
   Post.findById(req.params.id, function(err, foundPost){
     if(err) console.log(err);
     else{
       foundPost.vote();
       res.redirect("back");
     }
   });
});


// ====================COMMENTS==================================

app.get('/posts/:id/comments/new', isLoggedIn, function(req, res) {
  Post.findById(req.params.id, function(err, foundPost){
    if(err){
      res.redirect("/");
    } else{
      res.render("comments/new", {post:foundPost});
    }
  });
});

app.post("/posts/:id/comments", isLoggedIn, function(req, res) {
    Post.findById(req.params.id, function(err, foundPost) {
       if(err){
         console.log(err);
       } else {
         Comment.create(req.body.comment, function(err, comment){
           if(err){
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


app.get('/posts/:id/comments/:comment_id/edit', isLoggedIn, function(req, res) {
  Comment.findById(req.params.comment_id, function(err, foundComment) {
     if(err) {
       console.log(err);
     } else {
       res.render('comments/edit', {post_id : req.params.id, comment:foundComment}); 
     }
  });
});

app.put('/posts/:id/comments/:comment_id', isLoggedIn, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, UpdatedComment){
    if(err){
      console.log(err);
    } else {
      res.redirect("/posts/" + req.params.id);
    }
  });
});

app.delete('/posts/:id/comments/:comment_id', isLoggedIn, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err, foundComment){
    if(err) {
      console.log(err);
    } else {
      res.redirect("back");
    }
  });
});


// ====================Friends==================================

app.get('/users/:id/friends', isLoggedIn, function(req, res) {
  User.findById(req.params.id).populate("friends").exec(function(err, foundUser){
    if(err){
      res.redirect("/");
    } else{
      res.render("friends/index", {user:foundUser});
    }
  });
});

app.post('/users/:id/friends', isLoggedIn, function(req, res) {
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

//delete a friend
app.delete('/users/:id/friends/:friend_id', isLoggedIn, function(req, res){
  User.findByIdAndRemove(req.params.friend_id, function(err, foundFriend){
    if(err) {
      console.log(err);
    } else {
      res.redirect("back");
    }
  });
});

// ====================USER==================================
app.get('/users/:id', function(req, res) {
    User.findById(req.params.id).populate("posts").exec(function(err, foundUser){
        if(err){
            res.redirect("/");
        } else{
            res.render("users/index", {user:foundUser});
        }
    });
});

app.get('/users/:id/edit', isLoggedIn, function(req, res) {
  User.findById(req.params.id, function(err, foundUser) {
      if(err){
        console.log(err);
      } else {
        res.render('users/edit', {user:foundUser});
      }
  });
});


app.put('/users/:id', isLoggedIn, function(req, res){
  User.findById(req.params.id, function(err, foundUser) {
    if(err){
      console.log(err);
    }else{
      foundUser.UpdateInfo(req.body.email, req.body.username, req.body.about, req.body.avatar);
      res.redirect("/users/" + req.params.id);
    }
  });
});

// ====================AUTHENTICATION=============================
app.get('/register', function(req, res){
  res.render("register");
});

app.post('/register', function(req, res){
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


app.get('/login', function(req, res){
  res.render("login");
});

app.post('/login', passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login"
}), function(req, res){
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect("/");
});

//---------To handle undefined routes-------------------
app.get("*", function(req, res){
  res.send("Oops! Something went wrong.");
});
// -------------------------------------------------------


//middleware for checking session
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
  console.log("Server is running ");
});
