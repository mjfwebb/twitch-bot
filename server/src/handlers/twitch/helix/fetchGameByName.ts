import fetch from 'node-fetch';
import { getCurrentAccessToken } from '../../../auth/twitch';
import Config from '../../../config';
import { TWITCH_HELIX_URL } from '../../../constants';
import type { TwitchGame } from '../../../types';
import { assertArray } from '../../../utils/assertArray';
import { hasOwnProperty } from '../../../utils/hasOwnProperty';

export const fetchGameByName = async (name: string): Promise<TwitchGame | null> => {
  try {
    const url = `${TWITCH_HELIX_URL}games?name=${name}`;
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
        hasOwnProperty(result.data[0], 'id') &&
        typeof result.data[0].id === 'string' &&
        hasOwnProperty(result.data[0], 'name') &&
        typeof result.data[0].name === 'string' &&
        hasOwnProperty(result.data[0], 'box_art_url') &&
        typeof result.data[0].box_art_url === 'string' &&
        hasOwnProperty(result.data[0], 'igdb_id') &&
        typeof result.data[0].igdb_id === 'string'
      ) {
        return result.data[0] as TwitchGame;
      }
    }
  } catch (error) {
    console.error(error);
  }

  return null;
};
