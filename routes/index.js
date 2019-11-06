const express = require("express");//used for dealing with incoming http requests on this page
const fs = require("fs");//Used to get the html files which are sent to the user
const router = express.Router();//defining the router which is used to deal with incoming http request in this case only GET request is accepted


router.get("/", function (req, res, next){//When a get request is made on this directory on this server this function is called
	
	console.log("connection of index-home");
	
	var template = fs.readFileSync(process.cwd() + "/index.html", "utf8");//Gets the html home page

	res.send(template);//Sends to the user
	
});



module.exports = router;//Makes router available to other js files (used in app)