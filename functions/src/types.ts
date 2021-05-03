// Tweet related types

export enum TagType {
  LIKES = 'likes',
  RETWEETS = 'retweets',
  HOURS = 'hours',
  MINUTES = 'minutes',
}

export interface TextAreaContent {
  text: string;
  files: { file: File; alt: string; url?: string; refPath?: string }[];
}

export interface FollowupTweet {
  id: string;
  content: string[];
  tags: { type: TagType; value: string }[];
}

export interface ScheduledTweetPayload {
  id: string;
  userId: string;
  content: TextAreaContent[];
  localScheduledTime: string;
  utcScheduledTime: string;
  posted: boolean;
  timezone: string;
  followupTweets: FollowupTweet[];
}

// TWIT API TYPES
export interface MediaUploadResponse {
  media_id: number;
  media_id_string: string;
  size: number;
  expires_after_secs: number;
  image: { image_type: string; w: number; h: number };
}
