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
        		console.log('getting erpson')

        		return getTweets(person).then(data => data)
        		
		        	
        	
        	
	  		// } else {
	  		// 	console.log('noone')
	  		// 	return `no person for tweets`;
	  		// }
            
        }
    }
};



function getTweets(person){

	return new Promise((resolve, reject)=> {
		// resolve('hello')
		if (person && person.twitter){
    		// resolve([{text:"Hello"}])
    		var params = {screen_name: person.twitter};
        	TwitterClient .get('statuses/user_timeline', params, function(error, tweets, response) {
			  if (!error) {
			  	
			    // let texts = []
			    // tweets.forEach((tweet, i) => {
			    // 	console.log('tweet', tweet.text)
			    // 	texts.push(tweet.text)
			    // })
			    // console.log('success')
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