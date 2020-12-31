import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { auth, twitterAuthProvider } from '../../firebaseConfig';
import { setLoggedIn, setLoggedOut } from '../actions/authActions';
import { UserProfile, UserStatuses } from '../commonTypes';

export const signIn = createAsyncThunk('auth/signIn', async () => {
  localStorage.setItem('loggingIn', 'true');
  auth.signInWithRedirect(twitterAuthProvider);
});

export const signOut = createAsyncThunk('auth/signOut', async () => {
  localStorage.removeItem('user');
  return auth.signOut();
});

export const getTokenAndSecret = createAsyncThunk(
  'auth/getTokenAndSecret',
  async () => {
    auth
      .getRedirectResult()
      .then(function (result) {
        if (result.credential) {
          // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
          // You can use these server side with your app's credentials to access the Twitter API.
          // @ts-ignore
          const token = result.credential.accessToken;
          // @ts-ignore
          const secret = result.credential.secret;

          // check if user is already in the database
          axios
            .get(`http://localhost:5000/api/user/${result.user?.uid}`)
            .then((res) => {
              if (res.data) {
                // if user already in db, do nothing
                return res.data;
              } else {
                const userPayload = {
                  name: result.user?.displayName,
                  twitterUid: result.user?.uid,
                  twitterSecret: secret,
                  twitterToken: token,
                };

                // put user and their access tokens in database
                axios
                  .post('http://localhost:5000/api/user', userPayload)
                  .catch((e) => console.log(e));
              }
            })
            .catch((e) => console.log(e));
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
