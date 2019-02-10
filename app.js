var express = require('express'),
    mongoose = require('mongoose'),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    User = require("./models/user"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    Post = require("./models/post"),
    path = require('path'),
    methodOverride = require("method-override"),
    Comment = require("./models/comment"),
    async = require('async'),
        middleware = require("./middleware");

var postsRoutes = require("./routes/posts"),
    votesRoutes = require("./routes/votes"),
    commentsRoutes = require("./routes/comments"),
    friendsRoutes = require("./routes/friends"),
    userRoutes = require("./routes/users"),
    indexRoutes = require("./routes/index"),
    chatRoutes = require("./routes/chat");

//database

// mongoose.connect("mongodb://localhost/challenge3");
mongoose.connect("mongodb://user:challenge3@ds113580.mlab.com:13580/challenge3");


var app = express();


//setup app
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(require("express-session")({
    secret: "The team has no name",
    resave: false,
    saveUninitialized: false
}));
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
//middleware for passing current user to each route
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});
app.use(express.static(path.join(__dirname, 'public')));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




// ===================ROUTES===============================
app.use(postsRoutes);
app.use(votesRoutes);
app.use(commentsRoutes);
app.use(friendsRoutes);
app.use(userRoutes);
app.use(chatRoutes);
app.use(indexRoutes);
//=====================ROUTES END==========================

//===================SOCKETIO===========================================
var server = app.listen(process.env.PORT, process.env.IP, function() {
        console.log("Server is running ");
    }),
    io = require('socket.io').listen(server);


var messages = [];
var sockets = [];

io.on('connection', function(socket) {
    messages.forEach(function(data) {
        socket.emit('message', data);
        console.log(data);
    });

    sockets.push(socket);

    socket.on('disconnect', function() {
        sockets.splice(sockets.indexOf(socket), 1);
        updateRoster();
    });

    socket.on('message', function(msg) {
        var text = String(msg || '');

        if (!text)
            return;

        socket.get('name', function(err, name) {
            if (err) {
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

    socket.on('identify', function(name) {
        socket.set('name', String(name || 'Anonymous'), function(err) {
            if (err) {
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
        function(socket, callback) {
            socket.get('name', callback);
        },
        function(err, names) {
            if (err) {
                console.log(err);
            } else {
                broadcast('roster', names);
            }
        }
    );
}

function broadcast(event, data) {
    sockets.forEach(function(socket) {
        socket.emit(event, data);
    });
}

//===================SOCKETIO END========================================

//---------To handle undefined routes-------------------
app.get("*", function(req, res) {
    res.send("Oops! Something went wrong.");
});
// -------------------------------------------------------