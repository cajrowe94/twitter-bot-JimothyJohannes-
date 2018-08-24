
var Twit = require('twit');
var config = require('./config');
var T = new Twit(config);
var request = require('request');

var randomFoxUrl = 'https://randomfox.ca/floof/';

var kokomo = ['-86.218798','40.382844','-86.033738','40.559707'];
//different streams to use
var userStream = T.stream('user');
var filterStream = T.stream('statuses/filter', { track: 'donald trump' })

var key = '1180cb522da599c45b50b05293c07dea2db8d13269695daf3';

var getPronoun = 'https://api.wordnik.com/v4/words.json/randomWord?hasDictionaryDef=true&includePartOfSpeech=pronoun&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&api_key=' + key;

var getNoun = 'https://api.wordnik.com/v4/words.json/randomWord?hasDictionaryDef=true&includePartOfSpeech=pronoun&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&api_key=' + key;

var getAdjective = 'https://api.wordnik.com/v4/words.json/randomWord?hasDictionaryDef=true&includePartOfSpeech=adjective&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&api_key=' + key;

var getAdverb = 'https://api.wordnik.com/v4/words.json/randomWord?hasDictionaryDef=true&includePartOfSpeech=adverb&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&api_key=' + key;


var potatoReplies = [
	" ...potato",
	" potato",
	" uhhh.. potato?",
	" ...potato?",
	" POTATO",
	" potato?",
];

var randomUser;
var foxPixs = [];

var replyToId;

var pronoun;
var adjective;
var adverb;

var wordtoChange;

console.log("Bot running." + '\n');

//--------------------------------------------
//----------------STREAMS---------------------

//stream to listen for any kind of tweets
// userStream.on('tweet', function(tweet){
// 	console.log('Tweet: ' + tweet.text + '\n');	
// 	console.log("-------------");
// });

// //listen for when you get followed
// userStream.on('follow', followed);

// //post malone tweets stream
// filterStream.on('tweet', filteredStream);

setInterval(function(){
	console.log(getRandomSentence());
}, 5000);

//--------------------------------------------
//--------------FUNCTIONS---------------------

function getRandomFoxPic(){
	request(randomFoxUrl, function (error, response, data) {
  		if (!error && response.statusCode == 200) {
  			foxPixs = JSON.parse(data);
  		}
	})
}

function sendRandomTweet(){
	getRandomFoxPic();
	console.log(foxPixs.image);
}

function getRandomWord(link){
	var newWord;
	request(link, function (error, response, data) {
  		if (!error && response.statusCode == 200) {
  			newWord = JSON.parse(data);
  			wordtoChange = newWord.word;
  			console.log(wordtoChange);
  		}

	})
}

function getRandomSentence(){
	var sentence = "";

	//get a new word and change the 'wordtoChange' var to it, assign each new variable accordingly
	getRandomWord(getPronoun)
	pronoun = wordtoChange;
	getRandomWord(getAdverb);
	adverb = wordtoChange;
	getRandomWord(getAdjective);
	adjective = wordtoChange;

	sentence += pronoun;
	sentence += " is ";
	sentence += adverb;
	sentence += " ";
	sentence += adjective;
	sentence += ".";

	return sentence;

}

//when you get a post malone tweet
function filteredStream(tweet){
	//console.log("------------"+'\n'+tweet.text);
	console.log("-----------"+'\n'+tweet.user.screen_name);
	randomUser = tweet.user.screen_name;
	if (tweet.in_reply_to_status_id !== null) replyToId = tweet.in_reply_to_status_id;
}

//function for when I get followed
function followed(event){
	var name = event.source.name;
	var screenName = event.source.screen_name;
	console.log("-------------");
	console.log(event.source.screen_name + " followed me.");
	tweetThis('@' + screenName + potatoReplies[getRandomInt(0, 5)]);
}

//basic function for posting a new tweet
function tweetThis(text){
	this.tweet = text;

	var tweetText = {
		status: tweet
	}

	T.post('statuses/update', tweetText, postData);

	function postData(err, data, response){
		err ? console.log(err) : console.log("Sucessfully tweeted."+'\n'+"Tweet: "+tweetText.status+'\n'+"-------------");
	}

}

//search any kind of text through Twitter and how many results you want
function searchThis(text, number){
	this.searchMe = text;
	this.numTweets = number;

	var searchParams = {
		q: searchMe,
		count: numTweets
	}

	T.get('search/tweets', searchParams, gotData);

	function gotData(err, data, response){
		for (var i = 0; i < data.statuses.length; i++){
			console.log('Tweet #' + i + ': ' + data.statuses[i].text + '\n');
		}	
	}
}

function getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
            
function getRandomFloat(min, max){
    return Math.random() * (max - min) + min;
}



