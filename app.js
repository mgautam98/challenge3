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
    Comment                     = require("./models/comment"),
    async                       = require('async'),
    middleware                  = require("./middleware");

var postsRoute                  = require("./routes/posts"),
    commentsRoute               = require("./routes/comments"), 
    userRoute                   = require("./routes/users");

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
app.use(postsRoute);
// --------------------Likes----------------------
app.post('/posts/:id/vote', middleware.isLoggedIn, function(req, res) {
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

app.use(commentsRoute);

// ====================Friends==================================

app.get('/users/:id/friends', middleware.isLoggedIn, function(req, res) {
  User.findById(req.params.id).populate("friends").exec(function(err, foundUser){
    if(err){
      res.redirect("/");
    } else{
      res.render("friends/index", {user:foundUser});
    }
  });
});

app.post('/users/:id/friends', middleware.isLoggedIn, function(req, res) {
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
app.delete('/users/:id/friends/:friend_id', middleware.isLoggedIn, function(req, res){
  User.findByIdAndRemove(req.params.friend_id, function(err, foundFriend){
    if(err) {
      console.log(err);
    } else {
      res.redirect("back");
    }
  });
});

app.use(userRoute);
// ====================CHAT=============================

app.get('/chat', middleware.isLoggedIn, function(req, res) {
  User.findById(req.user._id, function(err, foundUser) {
    if(err){
      console.log(err);
    }else{
      res.render('chat', {user:foundUser});
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

var server    = app.listen(process.env.PORT, process.env.IP, function(){
                  console.log("Server is running ");
                }),
    io        = require('socket.io').listen(server);
    

var messages = [];
var sockets = [];

io.on('connection', function (socket) {
    messages.forEach(function (data) {
      socket.emit('message', data);
      console.log(data);
    });

    sockets.push(socket);

    socket.on('disconnect', function () {
      sockets.splice(sockets.indexOf(socket), 1);
      updateRoster();
    });

    socket.on('message', function (msg) {
      var text = String(msg || '');

      if (!text)
        return;

      socket.get('name', function (err, name) {
        if(err){
          console.log(err);
        } else {
          var data = {
          name: name,
          text: text
          };

          broadcast('message', data);
          messages.push(data); 
        }
      });
    });

    socket.on('identify', function (name) {
      socket.set('name', String(name || 'Anonymous'), function (err) {
        if(err){
          console.log(err);
        } else {
          updateRoster();  
        }
      });
    });
  });

function updateRoster() {
  async.map(
    sockets,
    function (socket, callback) {
      socket.get('name', callback);
    },
    function (err, names) {
      if(err){
        console.log(err);
      }else{
        broadcast('roster', names);
      }
    }
  );
}

function broadcast(event, data) {
  sockets.forEach(function (socket) {
    socket.emit(event, data);
  });
}

//---------To handle undefined routes-------------------
app.get("*", function(req, res){
  res.send("Oops! Something went wrong.");
});
// -------------------------------------------------------
