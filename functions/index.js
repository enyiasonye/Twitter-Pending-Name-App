const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const twitterTokens = require('./keys');
const { TwitThread } = require('twit-thread');
const app = express();
app.use(cors({ origin: true }));

// TODO: Obfuscate permissions.json and keys.js
var serviceAccount = require('./permissions.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://tweethresh.firebaseio.com',
});

const db = admin.firestore();
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

      const t = new TwitThread({
        consumer_key: twitterTokens.TWITTER_CONSUMER_KEY,
        consumer_secret: twitterTokens.TWITTER_CONSUMER_SECRET,
        access_token: tokens.twitterToken,
        access_token_secret: tokens.twitterSecret,
      });

      const formattedTweetContent = req.body.content.map((tweet) => {
        return { text: tweet };
      });
      // tweet out thread
      await t.tweetThread(formattedTweetContent);

      // add to db for history purposes
      await tweetRef.doc(req.body.id).set(req.body);
      res.json('Ok');
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }
});

exports.app = functions.https.onRequest(app);
