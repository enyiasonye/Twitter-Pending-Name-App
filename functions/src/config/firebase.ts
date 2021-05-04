import * as admin from 'firebase-admin';
const serviceAccount = require('./permissions.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://tweethresh.firebaseio.com',
  storageBucket: 'tweethresh.appspot.com',
});

const db = admin.firestore();
const bucket = admin.storage().bucket();
const userRef = db.collection('users');
const tweetRef = db.collection('tweets');

export { bucket, userRef, tweetRef };
