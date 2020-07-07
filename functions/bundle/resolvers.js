const Twitter = require('twitter')


var TwitterClient = new Twitter({
  consumer_key: process.env.TWITTER_KEY,
  consumer_secret: process.env.TWITTER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_SECRET
});


const resolvers = {
    Person: {
        tweets(person, args, context, info){
    		return getTweets(person).then(data => data)
        }
    }
};



function getTweets(person){
	return new Promise((resolve, reject)=> {
		if (person && person.twitter){

    		var params = {screen_name: person.twitter};
        	TwitterClient .get('statuses/user_timeline', params, function(error, tweets, response) {
			  if (!error) {
			   resolve(JSON.stringify(tweets))
			  } else {
			  	resolve('')
			  }
			});
		} else {
			resolve('')
		}
	})
}
module.exports = resolvers