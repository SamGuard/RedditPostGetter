const express = require('express');//Used for incoming http requests
const app = express();

//Defining the local directory of the routes
const display = require('./routes/display');
const index = require('./routes/index');

//Assigning directories to redirect the incoming request to
app.use("/",index);
app.use("/display",display);

//This deals with when a directory has not been found
app.use(function(req, res, next){
	res.send("<!DOCTYPE html><html>Directory not found!</html>");
});

 
module.exports = app;