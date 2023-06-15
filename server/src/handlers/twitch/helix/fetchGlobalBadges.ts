// https://api.twitch.tv/helix/chat/badges/global

import fetch from 'node-fetch';
import Config from '../../../config';
import { TWITCH_HELIX_URL } from '../../../constants';
import { getCurrentAccessToken } from '../../../twitch';
import type { BadgeSet } from '../../../types';
import { assertArray } from '../../../utils/assertArray';
import { hasOwnProperty } from '../../../utils/hasOwnProperty';

export const fetchGlobalBadges = async (): Promise<BadgeSet[] | null> => {
  if (Config.twitch) {
    try {
      const url = `${TWITCH_HELIX_URL}chat/badges/global`;
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
          hasOwnProperty(result.data[0], 'set_id') &&
          hasOwnProperty(result.data[0], 'versions') &&
          Array.isArray(result.data[0].versions)
        ) {
          return result.data as BadgeSet[];
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  return null;
};
