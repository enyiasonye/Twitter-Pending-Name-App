import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ScheduledTweetPayload } from '../commonTypes';

export const postNow = createAsyncThunk(
  'tweet/postNow',
  async (tweet: ScheduledTweetPayload) => {
    return axios.post('http://localhost:5000/api/tweet', tweet);
  },
);
