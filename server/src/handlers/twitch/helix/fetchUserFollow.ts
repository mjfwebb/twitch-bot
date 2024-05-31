// https://api.twitch.tv/helix/channels/followers
// Required scope: moderator:read:followers

import fetch from 'node-fetch';
import { getCurrentAccessToken } from '../../../auth/twitch';
import Config from '../../../config';
import { TWITCH_HELIX_URL } from '../../../constants';
import { logger } from '../../../logger';
import { assertArray } from '../../../utils/assertArray';
import { hasOwnProperty } from '../../../utils/hasOwnProperty';

type UserFollow = {
  total: number;
  data: {
    user_id: string;
    user_login: string;
    user_name: string;
    followed_at: string;
  }[];
  pagination: {
    cursor: string;
  };
};

export const fetchUserFollow = async (userId: string): Promise<UserFollow | null> => {
  try {
    const url = `${TWITCH_HELIX_URL}channels/followers?user_id=${userId}&broadcaster_id=${Config.twitch.broadcaster_id}`;
    const accessToken = getCurrentAccessToken();

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Client-Id': Config.twitch.client_id,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const result: unknown = await response.json();

    if (hasOwnProperty(result, 'data')) {
      assertArray(result.data);
      if (result.data.length > 0 && hasOwnProperty(result.data[0], 'followed_at') && typeof result.data[0].followed_at === 'string') {
        return result as UserFollow;
      }
    }
  } catch (error) {
    logger.error(error);
  }

  return null;
};
