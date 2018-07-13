const TwitterClient = require('twitter');

class Twitter {
  constructor() {
    this.client = new TwitterClient({
      consumer_key: process.env.CONSUMER_KEY,
      consumer_secret: process.env.CONSUMER_SECRET,
      access_token_key: process.env.ACCESS_TOKEN_KEY,
      access_token_secret: process.env.ACCESS_TOKEN_SECRET
    });
  }

  getAllFollowers(screen_name, cursor) {
    let url = `followers/ids.json?screen_name=${screen_name}&count=5000`;

    if (cursor) {
      url = `${url}&cursor=${cursor}`;
    }

    return new Promise((resolve, reject) => {
      this.client.get(url, (error, followers, response) => {
        if (error) {
          console.log(JSON.stringify(error));
          reject(error);
        } else {
          resolve(followers);
        }
      });
    });
  }
}

module.exports = Twitter;