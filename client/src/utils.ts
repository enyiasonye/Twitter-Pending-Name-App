import { format } from 'date-fns';
import { ScheduledTweet } from './store/commonTypes';

// TIME UTILS

// Takes in a date and returns a string in the format H:MM PM
export const extractConvertedTime = (time: string) => {
  const convertedTime = new Date(time);
  return format(convertedTime, 'p');
};

// takes in a date and returns a boolean for whether it's in the past
export const isThePast = (selectedTime: Date) => {
  const now = new Date();
  return selectedTime < now;
};

export const isToday = (time: string) => {
  const today = new Date();
  const convertedTime = new Date(time);
  return (
    convertedTime.getDate() === today.getDate() &&
    convertedTime.getMonth() === today.getMonth() &&
    convertedTime.getFullYear() === today.getFullYear()
  );
};

export const isTomorrow = (time: string) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const convertedTime = new Date(time);
  return (
    convertedTime.getDate() === tomorrow.getDate() &&
    convertedTime.getMonth() === tomorrow.getMonth() &&
    convertedTime.getFullYear() === tomorrow.getFullYear()
  );
};

// Returns a date in the format Saturday, Nov 28
export const convertDate = (time: string) => {
  const convertedTime = new Date(time);
  return format(convertedTime, 'EEEE, MMM d');
};

// TODO: figure out how to sort this based off date
export const categorizeTweetSchedule = (tweets: ScheduledTweet[]) => {
  // const organizedTweets: OrganizedTweets = {};
  const organizedTweets = new Map<string, ScheduledTweet[]>();

  tweets.forEach((tweet) => {
    // if is today
    if (isToday(tweet.scheduledTime)) {
      // if today is a key, push
      if (organizedTweets.has('Today')) {
        organizedTweets.get('Today')?.push(tweet);
        return;
      } else {
        // declare new entry if not a key
        organizedTweets.set('Today', [tweet]);
        return;
      }
    }
    // if is tomorrow
    if (isTomorrow(tweet.scheduledTime)) {
      // if tomorrow is a key, push
      if (organizedTweets.has('Tomorrow')) {
        organizedTweets.get('Tomorrow')?.push(tweet);
        return;
      } else {
        // declare new entry if not a key
        organizedTweets.set('Tomorrow', [tweet]);
        return;
      }
    }

    // if converted date is key push
    if (organizedTweets.has(convertDate(tweet.scheduledTime))) {
      organizedTweets.get(convertDate(tweet.scheduledTime))?.push(tweet);
      return;
    } else {
      // declare new entry if not a key
      organizedTweets.set(convertDate(tweet.scheduledTime), [tweet]);
      return;
    }
  });
  return organizedTweets;
};

// ENV UTILS
export const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'replace_this'
    : 'http://localhost:5001/tweethresh/us-central1/app';
