const twitterErrorHandler = (errorCode: number) => {
  if (errorCode === 187) return "Oops! You've already tweeted that!";
  if (errorCode === 130)
    return 'It looks like Twitter is temporarily over capacity!';
  if (errorCode === 186) return 'Your Tweet needs to be shorter';
  if (errorCode === 327) return 'You have already retweeted this Tweet';
  if (errorCode === 385)
    return 'Tweet may have been deleted or is not visible to you';
  if (errorCode === 386)
    return 'This Tweet exceeds the number of allowed attachment types.';
  else return 'There was an error posting your tweet';
};

export default twitterErrorHandler;
