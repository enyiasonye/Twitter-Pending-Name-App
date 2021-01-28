import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { tweetRef } from '../../firebaseConfig';
import { BASE_URL } from '../../utils';
import { ScheduledTweetPayload } from '../commonTypes';

export const postNow = createAsyncThunk(
  'tweet/postNow',
  async (tweet: ScheduledTweetPayload) => {
    try {
      return axios.post(`${BASE_URL}/tweet`, tweet);
    } catch (error) {
      console.log(error);
    }
  },
);

export const queueTweet = createAsyncThunk(
  'tweet/queueUp',
  async (tweet: ScheduledTweetPayload) => {
    tweetRef.doc().set(tweet);
  },
);
