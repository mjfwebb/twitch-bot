import fetch from 'node-fetch';
import Config from '../../../config';
import { TWITCH_HELIX_URL } from '../../../constants';
import { getCurrentAccessToken } from '../../../twitch';
import { assertArray } from '../../../utils/assertArray';
import { hasOwnProperty } from '../../../utils/hasOwnProperty';

export const fetchGameByName = async (name: string): Promise<string> => {
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
      if (result.data.length > 0 && hasOwnProperty(result.data[0], 'id') && typeof result.data[0].id === 'string') {
        return result.data[0].id;
      }
    }
  } catch (error) {
    console.error(error);
  }

  return '';
};
