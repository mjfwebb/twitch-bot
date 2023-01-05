// https://api.twitch.tv/helix/users?login=[username]

import Config from '../config';
import { TWITCH_HELIX_URL } from '../constants';
import { fetchWithRetry, getCurrentAccessToken } from '../twitch';
import { assertArray } from '../utils/assertArray';
import { hasOwnProperty } from '../utils/hasOwnProperty';

// interface UserResponse {
//   id: string;
//   login: string;
//   display_name: string;
//   type: 'admin' | 'global_mod' | 'staff' | '';
//   broadcaster_type: 'affiliate' | 'partner' | '';
//   description: string;
//   profile_image_url: string;
//   offline_image_url: string;
//   view_count: number;
//   email: string;
//   created_at: string;
// }

export const getUserIdByName = async (name: string): Promise<string> => {
  if (Config.twitch) {
    try {
      const url = `${TWITCH_HELIX_URL}users?login=${name}`;
      const accessToken = getCurrentAccessToken();

      const result = await fetchWithRetry(url, {
        method: 'GET',
        headers: {
          'Client-Id': Config.twitch.client_id,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (hasOwnProperty(result, 'data')) {
        const userData: unknown = result.data;
        assertArray(userData);
        if (hasOwnProperty(userData[0], 'id')) {
          if (typeof userData[0].id === 'string') {
            return userData[0].id;
          }
        }
      }
      throw new Error(`Unable to get user ID for user with name ${name}`);
    } catch (error) {
      console.error(error);
    }
  }
  return '';
};
