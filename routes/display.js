const express = require("express");//used for dealing with incoming http requests on this page
const fs = require("fs");//Used to get the html files which are sent to the user
const url = require("url");//Used for getting the current url of the page, used to get POST variables from url
var getPosts = require("./getPosts.js");//Used to get and filter the data from reddit
 
const router = express.Router();//router handles the incoming http requests
var body = "";


function fullUrl(req) {//This is used to get the current url
	  return url.format({
	    protocol: req.protocol,
	    host: req.get('host'),
	    pathname: req.originalUrl
	  });
}



function getVar(u,varPos){//Used to get the variables posted in the url
	var equalPos = -1;//Stores where the equal sign is
	var amperPos = -1;//Stores where the & is
	var varCounter = 0;//Counts how many sets of "=" and "&" that have been passed, used for getting variables from urls which have multiple varialbes in them

	for(var i = 0; i < u.length; i++){//Scans through each character in the url
		if (equalPos <= -1 && u[i] === "="){
			if(varCounter === varPos){
				equalPos = i;
			}
		}
		if(amperPos <= -1 && u[i] === "&"){
			if(varCounter != varPos){
				varCounter ++;
			}else{
				amperPos = i;
			}
		}
	}
	return u.slice(equalPos+1,amperPos);//returns the part of the url that is between the desired "=" and "&", this will be the variable array
}

router.get("/", function (req, res, next){//Deals with the GET request on the display page

	var currentUrl = fullUrl(req);//Gets url
	//This gets all the variables from the url
	var subreddit = getVar(currentUrl,0);
	var sort = getVar(currentUrl,1);
	var limit = getVar(currentUrl,2);

	console.log("connection of index-subreddit");
	
	template = fs.readFileSync(process.cwd() + "/displayRes.html", "utf8");//This gets the html file for displaying results

	posts = getPosts.getPosts(subreddit, sort, limit);//This gets and stored the filtered data from reddit
	var string = ""

	//This is to catch any errors returned by getPosts
	if(posts === "404"){
		string = "<div>Please enter a valid subreddit</div>"
	}else if (posts === "NAN"){
		string = "<div>Please enter a valid number of posts";
	}else if(posts === "EMPTY"){
		string = "<div>Please enter a subreddit title</div>"
	}else{
		//This creates the html to inject into the displayRes file
		for(var i = 0; i < posts.length; i++){
			if (posts[i].thumbnail === "" || posts[i].thumbnail === "default" || posts[i].thumbnail === "self"){//Catches errors for when the thumbnail of a post is not available
				string += `<tr><th>${posts[i]["title"]}</th><th>${posts[i]["upvotes"]}</th><th>N/A</th><th><a href="https://reddit.com/${posts[i].link}">link</a></th></tr>`;
			}else if(posts[i].thumbnail === "nsfw"){//For when a posts has nsfw content the thumbnail will be blank
				string += `<tr><th>${posts[i]["title"]}</th><th>${posts[i]["upvotes"]}</th><th>NSFW</th><th><a href="https://reddit.com/${posts[i].link}">link</a></th></tr>`;
			}else{
				string += `<tr><th>${posts[i]["title"]}</th><th>${posts[i]["upvotes"]}</th><th> <img src="${posts[i].thumbnail}"></th><th><a href="https://reddit.com/${posts[i].link}">link</a></th></tr>`;
			}
		}

		
	}
	//this scans through the displayRes html file and finds the "@START" this shows where the html string should be placed
	for(var i = 0; i < template.length-6; i++){
			if (template.substr(i,6) === '@START'){
				template = template.slice(0,i-1) + string + template.slice(i+6,template.length);
				break;
			}
			
	}
	
	res.send(template);
	
});

 
 
module.exports = router;