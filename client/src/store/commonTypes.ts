// TYPESCRIPT TYPES
export type Maybe<T> = T | null;

// USER RELATED TYPES

export interface UserSettings {
  timezone: string;
}

export interface UserProfile {
  displayName: Maybe<string>;
  uid: string;
  profileImageUrl: Maybe<string>;
  settings: Maybe<UserSettings>;
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
  localScheduledTime: string;
  utcScheduledTime: string;
  posted: boolean;
  followupTweets: FollowupTweet[];
}

export interface TextAreaContent {
  text: string;
  files: { file: File; alt: string; url?: string; refPath?: string }[];
}

export interface ScheduledTweetPayload {
  id: string;
  userId: String;
  content: TextAreaContent[];
  localScheduledTime: string;
  utcScheduledTime: string;
  posted: boolean;
  timezone: string;
  followupTweets: FollowupTweet[];
}
