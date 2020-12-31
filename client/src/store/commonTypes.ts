// TYPESCRIPT TYPES
export type Maybe<T> = T | null;

// USER RELATED TYPES

export enum UserStatuses {
  ANONYMOUS = 'ANONYMOUS',
  SIGNED_IN = 'SIGNED_IN',
}

export interface UserProfile {
  status: UserStatuses;
  displayName: string | null;
  uid: string;
  profileImageUrl: string | null;
}

// TWEET RELATED TYPES

export enum TagType {
  LIKES = 'likes',
  RETWEETS = 'retweets',
  HOURS = 'hours',
  MINUTES = 'minutes',
}

export interface FollowupTweet {
  id: string;
  content: string[];
  tags: { type: TagType; value: string }[];
}

export interface ScheduledTweet {
  id: string;
  userId: String;
  content: string[];
  scheduledTime: string;
  followupTweets: FollowupTweet[];
}

export interface ScheduledTweetPayload {
  userId: String;
  content: string[];
  scheduledTime: string;
  followupTweets: FollowupTweet[];
}
