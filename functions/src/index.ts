import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';
import * as twitterTokens from '../keys';
import twitterErrorHandler from './utils/twitterErrorHandler';
import * as Twit from 'twit';
import { ScheduledTweetPayload } from './types';
import { bucket, tweetRef, userRef } from './config/firebase';
import { postTweetImage } from './utils/postTweetMedia';
import postTweet from './utils/postTweet';

const app = express();

app.use(cors({ origin: true }));

// TWEET ROUTES

// post a tweet
app.post('/tweet', async (req, res) => {
  if (req.body) {
    const tweet: ScheduledTweetPayload = req.body;
    const currentUser = await (await userRef.doc(tweet.userId).get()).data();
    if (currentUser) {
      const twitTweet = new Twit({
        consumer_key: twitterTokens.TWITTER_CONSUMER_KEY,
        consumer_secret: twitterTokens.TWITTER_CONSUMER_SECRET,
        access_token: currentUser.twitterToken,
        access_token_secret: currentUser.twitterSecret,
      });
      const postedTweetIds: string[] = [];
      try {
        //   map through contents of tweet payload
        for (const [index, status] of tweet.content.entries()) {
          // contains images
          const currentMediaIds: string[] = [];
          if (status.files.length > 0) {
            for (const file of status.files) {
              const downloadedFile = await bucket
                .file(`user-media/${file.refPath!}`)
                .download();
              const mediaId = await postTweetImage(
                twitTweet,
                downloadedFile[0].toString('base64'),
                file.alt,
              );
              currentMediaIds.push(mediaId);
            }
          }
          // Only try to thread if a tweet has been posted and
          // there is more than one tweet to post
          if (postedTweetIds.length > 0 && tweet.content.length > 1) {
            const postedTweet = await postTweet(
              twitTweet,
              status.text,
              currentMediaIds,
              postedTweetIds[index - 1],
            );
            postedTweetIds.push(postedTweet.id_str);
          } else {
            // first/only tweet in thread
            const postedTweet = await postTweet(
              twitTweet,
              status.text,
              currentMediaIds,
            );
            postedTweetIds.push(postedTweet.id_str);
          }
        }
        await tweetRef.doc(req.body.id).set(req.body);
        res.json('Ok');
      } catch (error) {
        console.error(error);
        res
          .status(error.statusCode)
          .send({ error, twitterMessage: twitterErrorHandler(error.code) });
      }
    } else {
      res.status(401).send('Unauthorized, user dos not have needed tokens');
    }
  }
});

exports.app = functions.https.onRequest(app);
