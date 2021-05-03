import * as Twit from 'twit';
import { MediaUploadResponse } from '../types';

export const postTweetImage = async (
  twitInstance: Twit,
  imageBuffer: string,
  altText?: string,
) => {
  //   Post initial piece of media
  const { data: mediaResponse } = (await twitInstance.post('media/upload', {
    media_data: imageBuffer,
  })) as { data: MediaUploadResponse };

  if (altText) {
    const metaParams = {
      media_id: mediaResponse.media_id_string,
      alt_text: { text: altText },
    };
    await twitInstance.post('media/metadata/create', metaParams);
  }
  return mediaResponse.media_id_string;
};
