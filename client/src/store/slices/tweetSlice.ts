import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ScheduledTweet, ScheduledTweetPayload, TagType } from '../commonTypes';

interface TweetSliceState {
  scheduledTweets: ScheduledTweet[];
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
      scheduledTime: today.toString(),
      followupTweets: [],
    },
    {
      id: '2',
      userId: 'UHOWWoJj2wXwemEepfO6EsQGI112',
      content: ['This is a much shorter tweet that can still have followups'],
      scheduledTime: tomorrow.toString(),
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
    },
    {
      id: '3',
      userId: 'UHOWWoJj2wXwemEepfO6EsQGI112',
      content: ['This is a third tweet that is further in the future'],
      scheduledTime: furtherDay.toString(),
      followupTweets: [],
    },
  ],
};

const tweetSlice = createSlice({
  name: 'tweets',
  initialState,
  reducers: {
    scheduleTweet(
      state: TweetSliceState,
      action: PayloadAction<ScheduledTweetPayload>,
    ) {},
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

// export const { updateTweetDraft } = tweetSlice.actions;
export default tweetSlice.reducer;
