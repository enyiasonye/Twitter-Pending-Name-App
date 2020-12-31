const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Tweet = require('../models/tweet');
const keys = require('../config/keys');
const Twitter = require('twitter');
const { TwitThread } = require('twit-thread');
// USER ROUTES

router.get('/user/:id', (req, res, next) => {
  User.findOne({ twitterUid: req.params.id }, 'name')
    .then((data) => res.json(data))
    .catch(next);
});

router.post('/user', (req, res, next) => {
  if (req.body) {
    User.create(req.body)
      .then((data) => res.json(data))
      .catch(next);
  } else {
    res.json({
      error: 'The input field is empty',
    });
  }
});

// TWEET ROUTES

// immediately post tweet
// TODO: Handle for followup tweets
router.post('/tweet', async (req, res, next) => {
  if (req.body) {
    try {
      // get user tokens
      // TODO: Put user id in cookie
      const tokens = await User.findOne(
        { twitterUid: req.body.userId },
        'twitterSecret twitterToken',
      );

      const t = new TwitThread({
        consumer_key: keys.TWITTER_CONSUMER_KEY,
        consumer_secret: keys.TWITTER_CONSUMER_SECRET,
        access_token: tokens.twitterToken,
        access_token_secret: tokens.twitterSecret,
      });

      const formattedTweetContent = req.body.content.map((tweet) => {
        return { text: tweet };
      });
      await t.tweetThread(formattedTweetContent);
      res.json('Ok');
    } catch (e) {
      next(e);
    }
  } else {
    res.json({
      error: 'The input field is empty',
    });
  }
});

// gueue up tweet
router.post('/tweet/queue', async (res, req, next) => {});

// router.delete('/todos/:id', (req, res, next) => {

// })

module.exports = router;
