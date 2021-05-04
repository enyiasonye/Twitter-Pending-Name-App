import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
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

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export type RootState = ReturnType<typeof store.getState>;
export default store;
