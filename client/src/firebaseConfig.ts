import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

// this is to secure it when its on github, you'll need to secure it
// differently when you build the app and actually deploy

// eventually create second firebase project in order to separate environments

// TODO: remove localhost from https://console.developers.google.com/apis/credentials/key/a26824cb-6afd-4340-ac20-edb6dcbea2c1?folder=&organizationId=&project=tweethresh
// before deploying
const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};
firebase.initializeApp(config);

const db = firebase.firestore();
const storageRef = firebase.storage().ref();
export const auth = firebase.auth();
export const userRef = db.collection('users');
export const tweetRef = db.collection('tweets');
export const userMediaRef = storageRef.child('user-media');
export const stateChanged = firebase.storage.TaskEvent.STATE_CHANGED;
export const twitterAuthProvider = new firebase.auth.TwitterAuthProvider();
