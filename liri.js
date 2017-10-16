	// Node module imports needed to run the functions
	var fs = require("fs"); //reads and writes files
	var request = require("request");
	var keys = require("./keys.js");
	var Twitter = require("twitter");
	var Spotify = require ("node-spotify-api");
	var liriArgument = process.argv[2];
// ---------------------------------------------------------------------------------------------------------------
	// Possible commands for this liri app
	switch(liriArgument) {
		case "my-tweets": myTweets(); break;
		case "spotify-this-song": spotifyThisSong(); break;
		case "movie-this": movieThis(); break;
		case "do-what-it-says": doWhatItSays(); break;
		// Instructions displayed in terminal to the user
		default: console.log("\r\n" +"Try typing one of the following commands after 'node liri.js' : " +"\r\n"+
			"1. my-tweets 'any twitter name' " +"\r\n"+
			"2. spotify-this-song 'any song name' "+"\r\n"+
			"3. movie-this 'any movie name' "+"\r\n"+
			"4. do-what-it-says."+"\r\n"+
			"Be sure to put the movie or song name in quotation marks if it's more than one word.");
	};
// ---------------------------------------------------------------------------------------------------------------
// Functions
	// Movie function, uses the Request module to call the OMDB api
	function movieThis(){
		var movie = process.argv[3];
		if(!movie){
			movie = "mr nobody";
		}
		params = movie
		request("http://www.omdbapi.com/?t=" + params + "&y=&plot=short&apikey=40e9cece", function (error, response, body) {
			if (!error) {
				var movieObject = JSON.parse(body);
				console.log(movieObject); // Show the text in the terminal
				var movieResults =
				"------------------------------ Results ------------------------------" + "\r\n"
				"Title: " + movieObject.Title+"\r\n"+
				"Year: " + movieObject.Year+"\r\n"+
				"Imdb Rating: " + movieObject.imdbRating+"\r\n"+
				"Country: " + movieObject.Country+"\r\n"+
				"Language: " + movieObject.Language+"\r\n"+
				"Plot: " + movieObject.Plot+"\r\n"+
				"Actors: " + movieObject.Actors+"\r\n"+
				"Rotten Tomatoes Rating: " + movieObject.tomatoRating+"\r\n"+
				"Rotten Tomatoes URL: " + movieObject.tomatoURL + "\r\n" + 
				"------------------------------ Results End ------------------------------" + "\r\n";
				// console.log(movieResults);
				log(movieResults); 
				// calling log function
			} else {
				console.log("Error :"+ error);
				// return;
			}
		});
	};
	// Tweet function, uses the Twitter module to call the Twitter api
	function myTweets() {
		var client = new Twitter(keys.twitterKeys);
		var twitterUsername = process.argv[3];
		if(!twitterUsername){
			twitterUsername = "liriusblizzard";
		}
		params = {screen_name: twitterUsername};
		client.get("statuses/user_timeline/", params, function(error, data, response){
			if (!error) {
				for(var i = 0; i < data.length; i++) {
					//console.log(response); // Show the full response in the terminal
					var twitterResults = 
					"@" + data[i].user.screen_name + ": " + 
					data[i].text + "\r\n" + 
					data[i].created_at + "\r\n" + 
					"------------------------------ " + "Tweet" + (i+1) + " ------------------------------" + "\r\n";
					console.log(twitterResults);
					log(twitterResults); // calling log function
				}
			}  else {
				console.log("Error :"+ error);
				return;
			}
		});
	}
	// Spotify function, uses the Spotify module to call the Spotify api
	function spotifyThisSong(songName) {
		var songName = process.argv[3];
		var client_id = 'bcad004492ea4e1b84049694bb382ada'; // Your client id
		var client_secret = '7fc0ecefd1384dcbb4027a4d4a111c33'; // Your secret

		if(!songName){
			songName = "The Sign";
		}
		params = songName;

		var spotify = new Spotify ({ id: client_id, secret: client_secret});

		spotify.search({ type: "track", query: params }, function(err, data) {
			if(!err){
				// console.log(JSON.stringify(data,null,2));

				var songInfo = data.tracks.items;
				for (var i = 0; i < 5; i++) {
					if (songInfo[i] != undefined) {
						var spotifyResults =
						"Artist: " + songInfo[i].artists[0].name + "\r\n" +
						"Song: " + songInfo[i].name + "\r\n" +
						"Album the song is from: " + songInfo[i].album.name + "\r\n" +
						"Preview Url: " + songInfo[i].preview_url + "\r\n" + 
						"------------------------------ " + i + " ------------------------------" + "\r\n";
						console.log(spotifyResults);
						log(spotifyResults); // calling log function
					}
				}
			}	else {
				console.log("Error :"+ err);
				return;
			}
		});
	};
	// Do What It Says function, uses the reads and writes module to access the random.txt file and do what's written in it
	function doWhatItSays() {
		fs.readFile("random.txt", "utf8", function(error, data){
			if (!error) {
				doWhatItSaysResults = data.split(",");
				spotifyThisSong(doWhatItSaysResults[0], doWhatItSaysResults[1]);
			} else {
				console.log("Error occurred" + error);
			}
		});
	};
	// Do What It Says function, uses the reads and writes module to access the log.txt file and write everything that returns in terminal in the log.txt file
	function log(logResults) {
	  fs.appendFile("log.txt", logResults, (error) => {
	    if(error) {
	      throw error;
	    }
	  });
	}