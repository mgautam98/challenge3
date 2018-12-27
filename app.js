var http = require('http');
var path = require('path');
var async = require('async');
var socketio = require('socket.io');
var express = require('express');
var mongoose = require('mongoose');

//setup app
var app = express();
app.set("view engine", "ejs");

//database
mongoose.connect("mongodb://localhost/challenge3");


app.get('/', function(req, res){
  res.render("index");
});

app.get("*", function(req, res){
  res.send("Oops! Something went wrong.")
})

app.listen(process.env.PORT, process.env.IP, function(){
  console.log("Server is running ");
});
