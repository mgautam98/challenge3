var http = require('http');
var path = require('path');
var async = require('async');
var socketio = require('socket.io');
var express = require('express');

var app = express();
app.set("view engine", "ejs");


app.get('/', function(req, res){
  res.render("index");
});

app.get('/', function(req, res){
  res.send("Index page");
});

app.listen(process.env.PORT, process.env.IP, function(){
  console.log("Server is running ");
});
