var request = require("sync-request");//This uses sync request as the getPosts function was returning the data before requests had got the data
//Potential for improvement as would slow down drastically under high usage




function escapeSpecialChars(jsonString) {//removes any special characters from the json to avoid errors

            return jsonString.replace(/\n/g, "\\n")
                .replace(/\r/g, "\\r")
                .replace(/\t/g, "\\t")
                .replace(/\f/g, "\\f")
                .replace("'", "");

}

module.exports.getPosts = function(subreddit, sort, limit){//This function gets the reddit posts from a subreddit and filters the data to return the essential objects
	
	try{//Used for catching errors with the input data
		if(subreddit == ""){
			throw "EMPTY"
		}

		if(limit == ""){
			limit = 10;
		}
		limit = parseInt(limit);
		if (limit < 1){
			throw "NAN";//not a valid number
		}else if(limit > 100){
			limit = 100;
		}
	}catch(err){
		console.log(err);
		return err;
	}

	console.log("Get request on /getPost on subreddit "+subreddit+" sort by "+sort);
	
	req = request("GET", `https://www.reddit.com/r/${subreddit}/${sort}.json?limit=${limit}`);//uses the http request GET to get the subreddit data using reddit api
	
	
	

	try{
		body = req.getBody("utf8");//Gets the body data using utf8 encoding
	}catch(err){
		console.log(err);
		return "404";
	}
	body = escapeSpecialChars(body);
	body = JSON.parse(body);
	var length = parseInt(body.data.dist);
	var output = []
	if (length === 0){
		return "404"
	}

	for(var i = 0; i < length; i++){//This decides the data to keep and pass onto the user i chose to get the title, upvotes the link to the posts and the thunbnail
		output.push({"title":body.data.children[i].data.title,
			"upvotes":body.data.children[i].data.score,
			"link":body.data.children[i].data.permalink,
			"thumbnail":body.data.children[i].data.thumbnail});
	}

	return output;
	
}





