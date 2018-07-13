// @ts-check

const Twitter = require('./shared/Twitter');
const mongo = require('./shared/mongo');
const moment = require('moment');
const co = require('co');
//const followers = require('./json/followers-sample');

const twitter = new Twitter();
let db;

async function main() {
  db = await mongo.connect('horse');

  let results = await getTweets(db);

  let processed = [];

  results.forEach(item => {
    if (tweetProximityInMinutes(item) < 5) {
      console.log(results.indexOf(item));

      let screenName = item.original.user.screen_name;

      // if we have already processed this user for followers, don't do it again
      if (processed.includes(screenName)) {
        return;
      }

      // get the followers and save
      // getAndSaveFollowers(item);

      console.log(screenName);

      // keep track of who we've processed
      processed.push(screenName);
    }
  });
}

async function getAndSaveFollowers(tweet) {
  let followers = await getAllFollowers(tweet.original.user.screen_name);

  // store these followers in the database
  saveFollowers(db, tweet, followers);
}

async function getAllFollowers(screen_name, cursor, aggregator) {
  aggregator = aggregator || [];

  const result = await twitter.getAllFollowers(screen_name, cursor);

  aggregator = aggregator.concat(result.ids);

  if (!result.next_cursor) {
    return aggregator;
  }

  return getAllFollowers(screen_name, result.next_cursor_str, aggregator);
}

function tweetProximityInMinutes(result) {
  const horseCreatedAt = moment(new Date(result.horse.created_at));
  const originalCreatedAt = result.original ? moment(new Date(result.original.created_at)) : new Date('01-01-1900');

  let dif = moment
    .duration(horseCreatedAt.diff(originalCreatedAt))
    .asMinutes();

  return dif;
}

async function getTweets(db) {
  let results = await db.collection('timeSeries').find();
  return results.toArray();
}

async function saveFollowers(db, result, followers) {
  // store in the database
  let insertStatus = await db.collection('commonFollowers').update({
    id: result.original.id
  }, {
    id: result.original.id,
    original: result.original,
    followers: followers
  }, {
    upsert: true
  });
}

main();