const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
  },
  twitterUid: {
    type: String,
    required: [true, 'uid is required'],
  },
  twitterSecret: {
    type: String,
    required: [true, 'secret is required'],
  },
  twitterToken: {
    type: String,
    required: [true, 'token is required'],
  },
  timeZone: {
    type: String,
    required: [true, 'timezone is required'],
  },
});
module.exports = mongoose.model('User', userSchema, 'users');
