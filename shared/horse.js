const Twitter = require('twitter');
const mongo = require('./mongo');

async function populateTimeSeries() {
  // connect to database
  const db = await mongo.connect('horse');

  // initialize twitter client
  const config = {
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
  };

  const client = new Twitter(config);

  // get horsplain tweets
  let horsesplainTweets = await getHorsplainTweets(client);

  // for each horsplain tweet
  horsesplainTweets.forEach(async horsplainTweet => {
    // get the corresponding horse tweet
    let horseTweet = await getTweet(
      client,
      horsplainTweet.in_reply_to_status_id_str
    );

    // store in the database
    let insertStatus = await db.collection('timeSeries').update({
      id: horsplainTweet.id
    }, {
      id: horsplainTweet.id,
      horse: horseTweet,
      original: horsplainTweet.quoted_status
    }, {
      upsert: true
    });
  });
}

function getHorsplainTweets(client) {
  const params = {
    screen_name: 'horsplain_js',
    count: 200
  };

  return new Promise((resolve, reject) => {
    client.get('statuses/user_timeline', params, (error, tweets, response) => {
      if (error) {
        reject(error);
      }
      resolve(tweets);
    });
  });
}

function getTweet(client, originalTweetId) {
  return new Promise((resolve, reject) => {
    client.get(`statuses/show/${originalTweetId}`, (error, tweet, response) => {
      if (error) {
        reject(error);
      }

      resolve(tweet);
    });
  });
}

module.exports = {
  populateTimeSeries
};