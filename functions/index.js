const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const twitterTokens = require('./keys');
const twitterErrorHandler = require('./utils/twitterErrorHandler');
const { TwitThread } = require('twit-thread');
const Twit = require('twit');
const app = express();
app.use(cors({ origin: true }));

// TODO: Obfuscate permissions.json and keys.js, and bucket
var serviceAccount = require('./permissions.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://tweethresh.firebaseio.com',
  storageBucket: 'tweethresh.appspot.com',
});

const db = admin.firestore();
const bucket = admin.storage().bucket();
const userRef = db.collection('users');
const tweetRef = db.collection('tweets');

app.get('/hello-world', (req, res) => {
  return res.status(200).send('Hello World!');
});

// TWEET ROUTES

// immediately post tweet
// TODO: handle for followup tweets
app.post('/tweet', async (req, res) => {
  if (req.body) {
    try {
      // get user user for their tokens
      // TODO: put user id in cookie
      const tokens = await (await userRef.doc(req.body.userId).get()).data();
      // combine twitThread with twit (use twit to post multiple images and then use the mediaIds option)
      const twitThread = new TwitThread({
        consumer_key: twitterTokens.TWITTER_CONSUMER_KEY,
        consumer_secret: twitterTokens.TWITTER_CONSUMER_SECRET,
        access_token: tokens.twitterToken,
        access_token_secret: tokens.twitterSecret,
      });

      const twitTweet = new Twit({
        consumer_key: twitterTokens.TWITTER_CONSUMER_KEY,
        consumer_secret: twitterTokens.TWITTER_CONSUMER_SECRET,
        access_token: tokens.twitterToken,
        access_token_secret: tokens.twitterSecret,
      });
      // const file = await bucket.file('picture.jpg').download();

      const formattedTweetContent = req.body.content.map((tweet) => {
        return {
          text: tweet.text,
          options: {
            media_data: file[0].toString('base64'),
            alt_text: {
              text: 'this is some test text',
            },
          },
        };
      });
      // tweet out thread
      await twitThread.tweetThread(formattedTweetContent);

      // add to db for history purposes
      await tweetRef.doc(req.body.id).set(req.body);
      res.json('Ok');
    } catch (error) {
      console.error(error);
      return res
        .status(error.statusCode)
        .send({ error, twitterMessage: twitterErrorHandler(error.code) });
    }
  }
});

exports.app = functions.https.onRequest(app);
