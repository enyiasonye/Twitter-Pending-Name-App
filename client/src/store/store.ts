import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import tweetSlice from './slices/tweetSlice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    tweets: tweetSlice,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ['auth/listenToAuthChanges/fulfilled'],
    },
  }),
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
