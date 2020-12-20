// USER RELATED TYPES

export enum UserStatuses {
  ANONYMOUS = 'ANONYMOUS',
  SIGNED_IN = 'SIGNED_IN',
}

export interface UserProfile {
  status: UserStatuses;
  displayName: String | null;
  uid: String | null;
  profileImageUrl: String | null;
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
  content: string[];
  scheduledTime: string;
  followupTweets: FollowupTweet[];
}
