import { createAsyncThunk } from '@reduxjs/toolkit';
import { auth, twitterAuthProvider } from '../../firebaseConfig';
import { setLoggedIn, setLoggedOut } from '../actions/authActions';
import { UserProfile, UserStatuses } from '../commonTypes';

export const signIn = createAsyncThunk('auth/signIn', async () => {
  localStorage.setItem('loggingIn', 'true');
  auth.signInWithRedirect(twitterAuthProvider).then((result) => {
    console.log(result);
  });
});

export const signOut = createAsyncThunk('auth/signOut', async () => {
  localStorage.removeItem('user');
  return auth.signOut();
});

export const startListeningToAuthChanges = createAsyncThunk(
  'auth/listenToAuthChanges',
  async (doNotUse = undefined, thunkAPI) => {
    return auth.onAuthStateChanged((user) => {
      if (user) {
        const currentUser: UserProfile = {
          status: UserStatuses.SIGNED_IN,
          displayName: user.displayName,
          uid: user.uid,
          profileImageUrl: user.photoURL,
        };
        localStorage.setItem('user', JSON.stringify(currentUser));
        localStorage.removeItem('loggingIn');
        thunkAPI.dispatch(setLoggedIn(currentUser));
      } else {
        localStorage.removeItem('user');
        thunkAPI.dispatch(setLoggedOut());
      }
    });
  },
);
