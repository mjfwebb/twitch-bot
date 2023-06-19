//api.twitch.tv/helix/users/follows

import fetch from 'node-fetch';
import Config from '../../../config';
import { TWITCH_HELIX_URL } from '../../../constants';
import { getCurrentAccessToken } from '../../../twitch';
import { assertArray } from '../../../utils/assertArray';
import { hasOwnProperty } from '../../../utils/hasOwnProperty';

type UserFollow = {
  total: number;
  data: {
    from_id: string;
    from_login: string;
    from_name: string;
    to_id: string;
    to_name: string;
    followed_at: string;
  }[];
  pagination: {
    cursor: string;
  };
};

export const fetchUserFollow = async (userId: string): Promise<UserFollow | null> => {
  try {
    const url = `${TWITCH_HELIX_URL}users/follows?from_id=${userId}&to_id=${Config.twitch.broadcaster_id}`;
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
      if (
        result.data.length > 0 &&
        hasOwnProperty(result.data[0], 'from_id') &&
        typeof result.data[0].from_id === 'string' &&
        hasOwnProperty(result.data[0], 'to_id') &&
        typeof result.data[0].to_id === 'string'
      ) {
        return result as UserFollow;
      }
    }
  } catch (error) {
    console.error(error);
  }

  return null;
};
