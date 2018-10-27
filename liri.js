//requiring
var request = require("request");
require("dotenv").config();
const keys = require("./keys");
var Spotify = require('node-spotify-api');
var moment = require("moment");
var fs = require("fs");


//globals
var method = process.argv[2];
var mysearch = process.argv[3];
var spotify = new Spotify(keys.spotify);
var nodeArgs = process.argv;
var spacer = "";
var dataArr=[];
var answer = [];

//take all process.argvs and fill spaces accordingly
if  (method==="concert-this"){
            spacer = "%20";
        }else if(method==="spotify-this-song"){
            spacer= " ";
        }else if(method==="movie-this"){
            spacer="+";
        }

for (var i = 4 ; i< nodeArgs.length; i++){
    if(mysearch===""){
        mysearch = nodeArgs[i];
                    }   
    else{

        mysearch = mysearch + spacer + nodeArgs[i];
        }
    }


    //check the liri instruction as per user input
check();


//compare instructions and execute their respective function
function check(){
switch (method){
case "concert-this":
bands();
break;
case "spotify-this-song":
thesong();
break;
case "movie-this":
movie();
break;
case "do-what-it-says":
whatsays();
break;
}
}

//function for bandsintown
function bands(){
request("https://rest.bandsintown.com/artists/"+ mysearch+"/events?app_id=3f5f2c6a10b5fccad855aec4827d0085", function(error, response, body) {
    if (!error && response.statusCode === 200 && JSON.parse(body)[0]!= undefined)  {
        answer.push("\n"+method+" "+mysearch+ " \n");
        
        answer.push("name of the venue: "+  JSON.parse(body)[0].venue.name);
        answer.push("venue location: "+  JSON.parse(body)[0].venue.city + ", "+  JSON.parse(body)[0].venue.country);
        var fecha = moment(JSON.parse(body)[0].datetime).format("MM/DD/YYYY");
        answer.push("date of the event: "+ fecha);
        console.log(answer[1]);
        console.log(answer[2]);
        console.log(answer[3]);
       
        answer = answer[0]+answer[1]+"\n"+answer[2]+"\n"+answer[3]+"\n";
       
        logging(answer);
    }else{
    console.log("no future events available for this artist");
    }

})
}
//function for spotify
function thesong(){
    if(mysearch== undefined){
        mysearch="The Sign ace of base";
    }
    spotify.search({ type: 'track', query: mysearch }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
       answer.push("\n" +method + " "+ mysearch+"\n");
       answer.push("the band name is: "+data.tracks.items[0].artists[0].name); 
       answer.push("the song name is: "+ data.tracks.items[0].name);
       answer.push("preview link: "+data.tracks.items[0].preview_url );
       answer.push("album name: " +data.tracks.items[0].album.name);
       console.log(answer[1]);
       console.log(answer[2]);
       console.log(answer[3]);
       console.log(answer[4]);
       answer = answer[0]+answer[1]+"\n"+answer[2]+"\n"+answer[3]+"\n"+answer[4]+"\n";

        logging(answer);
      });


}

//function for omdb
function movie(){
    if(mysearch== undefined){
        mysearch="Mr.+Nobody";
    }

    request("http://www.omdbapi.com/?t=" + mysearch + "&y=&plot=short&apikey=b79fed7d", function(error, response, body) {

        if (!error && response.statusCode === 200) {
            answer.push("\n" +method + " "+ mysearch+"\n");
            answer.push("The movie's title is: " + JSON.parse(body).Title);
            answer.push("The movie's released year is: " + JSON.parse(body).Year);
            answer.push("The movie's IMDB rating is: " + JSON.parse(body).imdbRating);
            answer.push("The movie's rotten tomatoes rating is: " + JSON.parse(body).Ratings[1].Value);
            answer.push("The movie was produced in: " + JSON.parse(body).Country);
            answer.push("The movie's language is: " + JSON.parse(body).Language);
            answer.push("The movie's plot is: " + JSON.parse(body).Plot);
            answer.push("The movie's actors are: " + JSON.parse(body).Actors);
            console.log(answer[1]);
            console.log(answer[2]);
            console.log(answer[3]);
            console.log(answer[4]);
            console.log(answer[5]);
            console.log(answer[6]);
            console.log(answer[7]);
            console.log(answer[8]);
            answer = answer[0]+answer[1]+"\n"+answer[2]+"\n"+answer[3]+"\n"+answer[4]+"\n" +answer[5]+"\n"+answer[6]+"\n"+answer[7]+"\n"+answer[8]+"\n";
            logging(answer);
            }
            else{
                console.log("Movie not found");
            }
    })
}

//function for readfile
function whatsays(){
    fs.readFile("random.txt", "utf8", function(error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
          return console.log(error);
        } 
        dataArr=data.split(",");
        nodeArgs=dataArr;
        //nodeArgs.splice(0,0," ", " ");
        method = dataArr[0];
        mysearch=dataArr[1];
        check();
        logging();
})
}
//function to logg on a text file
function logging(text){
    fs.appendFile("log.txt", text, function(err) {

        // If an error was experienced we will log it.
        if (err) {
          console.log(err);
        }
      
        // If no error is experienced, we'll log the phrase "Content Added" to our node console.
        else {
          console.log("Content Added!");
        }
      
      });

}