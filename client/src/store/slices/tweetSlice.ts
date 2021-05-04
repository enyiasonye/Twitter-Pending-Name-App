import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ScheduledTweet, ScheduledTweetPayload, TagType } from '../commonTypes';

interface TweetSliceState {
  scheduledTweets: ScheduledTweet[];
  currentDraft: ScheduledTweet | null;
}

const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const furtherDay = new Date();
furtherDay.setDate(furtherDay.getDate() + 3);

const initialState: TweetSliceState = {
  scheduledTweets: [
    {
      id: '1',
      userId: 'UHOWWoJj2wXwemEepfO6EsQGI112',
      content: [
        `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque lobortis bibendum leo. 
        Aliquam vulputate nulla ornare dolor lacinia, pulvinar consectetur tellus accumsan. 
        Proin elementum neque vitae augue consequat dictum.`,
        `  Morbi et ullamcorper nibh, non rhoncus leo. Donec sagittis ex libero.
        Sed at sodales nisl. Fusce dignissim, libero vitae imperdiet
        ullamcorper, augue justo maximus nullam.`,
        'testing 123 is a valid sentence but the man wont let you know that is the case',
      ],
      localScheduledTime: today.toString(),
      utcScheduledTime: today.toUTCString(),
      followupTweets: [],
      posted: false,
    },
    {
      id: '2',
      userId: 'UHOWWoJj2wXwemEepfO6EsQGI112',
      content: ['This is a much shorter tweet that can still have followups'],
      localScheduledTime: tomorrow.toString(),
      utcScheduledTime: tomorrow.toUTCString(),
      followupTweets: [
        {
          id: '10',
          content: ['hey guys this is the followup tweet'],
          tags: [
            { type: TagType.RETWEETS, value: '40' },
            { type: TagType.LIKES, value: '50' },
          ],
        },
      ],
      posted: false,
    },
    {
      id: '3',
      userId: 'UHOWWoJj2wXwemEepfO6EsQGI112',
      content: ['This is a third tweet that is further in the future'],
      localScheduledTime: furtherDay.toString(),
      utcScheduledTime: furtherDay.toUTCString(),
      followupTweets: [],
      posted: false,
    },
  ],
  currentDraft: null,
};

const tweetSlice = createSlice({
  name: 'tweets',
  initialState,
  reducers: {
    updateCurrentDraft(
      state: TweetSliceState,
      action: PayloadAction<ScheduledTweet>,
    ) {
      state.currentDraft = action.payload;
    },
    updateScheduledTweet(
      state: TweetSliceState,
      action: PayloadAction<ScheduledTweet>,
    ) {
      const selectedTweetIndex = state.scheduledTweets.findIndex(
        (tweet) => tweet.id === action.payload.id,
      );
      state.scheduledTweets[selectedTweetIndex] = action.payload;
    },
    // scheduleTweet(
    //   state: TweetSliceState,
    //   action: PayloadAction<ScheduledTweetPayload>,
    // ) {},
  },
  //   extraReducers: (builder) => {
  //     builder.addCase(setLoggedIn, (state, action) => {
  //       state.userProfile = action.payload;
  //       state.applicationLoading = false;
  //     });
  //     builder.addCase(setLoggedOut, (state) => {
  //       state.userProfile = null;
  //       state.applicationLoading = false;
  //     });
  //     builder.addCase(signIn.fulfilled, (state, action) => {
  //     });
  //   },
});

export const { updateCurrentDraft } = tweetSlice.actions;
export default tweetSlice.reducer;
