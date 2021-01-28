import { createAsyncThunk } from '@reduxjs/toolkit';
import { auth, twitterAuthProvider, userRef } from '../../firebaseConfig';
import { setLoggedIn, setLoggedOut } from '../actions/authActions';
import { UserProfile } from '../commonTypes';

export const signIn = createAsyncThunk('auth/signIn', async () => {
  localStorage.setItem('loggingIn', 'true');
  auth.signInWithRedirect(twitterAuthProvider);
});

export const signOut = createAsyncThunk('auth/signOut', async () => {
  localStorage.removeItem('user');
  return auth.signOut();
});

// gets called on initial app load when you log in
export const getTokenAndSecret = createAsyncThunk(
  'auth/getTokenAndSecret',
  async (doNotUse = undefined, thunkAPI) => {
    auth
      .getRedirectResult()
      .then(async function (result) {
        if (result.credential) {
          // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
          // You can use these server side with your app's credentials to access the Twitter API.
          // @ts-ignore
          const token = result.credential.accessToken;
          // @ts-ignore
          const secret = result.credential.secret;
          // check if user is already in the database
          const currentUser = await userRef.doc(`${result.user?.uid}`).get();
          // if the user is not in the database, insert them
          if (!currentUser.exists) {
            userRef.doc(`${result.user?.uid}`).set({
              name: result.user?.displayName,
              twitterUid: result.user?.uid,
              twitterSecret: secret,
              twitterToken: token,
              // TODO: Come back and figure out what this default should be
              settings: {
                timezone: '',
              },
            });
          }
        }
      })
      .catch(function (error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        const credential = error.credential;
        // ...
      });
  },
);

// This will get called pretty much on refresh
export const startListeningToAuthChanges = createAsyncThunk(
  'auth/listenToAuthChanges',
  async (doNotUse = undefined, thunkAPI) => {
    return auth.onAuthStateChanged(async (user) => {
      if (user) {
        // get settings info from db
        const dbUser = await userRef.doc(`${user.uid}`).get();

        const currentUser: UserProfile = {
          displayName: user.displayName,
          uid: user.uid,
          profileImageUrl: user.photoURL,
          settings: dbUser.data()!['settings'],
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
