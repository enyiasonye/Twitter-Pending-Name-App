const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const tweetSchema = new Schema({
  content: {
    type: [String],
    required: [true, 'content is required'],
  },
});
module.exports = mongoose.model('Tweet', tweetSchema, 'tweets');
