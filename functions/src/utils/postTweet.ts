import * as Twit from 'twit';

const postTweet = async (
  twitInstance: Twit,
  content: string,
  mediaIds: string[],
  previousTweetId?: string,
) => {
  //   try {
  const params = {
    status: content,
    media_ids: mediaIds.length ? mediaIds : undefined,
    in_reply_to_status_id: previousTweetId,
  };
  const { data: postedTweet } = (await twitInstance.post(
    'statuses/update',
    params,
  )) as { data: any };
  return postedTweet;
};

export default postTweet;
