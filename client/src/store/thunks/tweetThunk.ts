import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { tweetRef } from '../../firebaseConfig';
import { BASE_URL } from '../../shared/utils';
import { ScheduledTweetPayload } from '../commonTypes';

export const postNow = createAsyncThunk(
  'tweet/postNow',
  async (tweet: ScheduledTweetPayload, { rejectWithValue }) => {
    try {
      await axios.post(`${BASE_URL}/tweet`, tweet);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const queueTweet = createAsyncThunk(
  'tweet/queueUp',
  async (tweet: ScheduledTweetPayload) => {
    tweetRef.doc().set(tweet);
  },
);
