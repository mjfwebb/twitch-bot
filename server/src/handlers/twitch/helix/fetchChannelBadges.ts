// https://api.twitch.tv/helix/chat/badges

import fetch from 'node-fetch';
import { getCurrentAccessToken } from '../../../auth/twitch';
import Config from '../../../config';
import { TWITCH_HELIX_URL } from '../../../constants';
import { logger } from '../../../logger';
import type { BadgeSet } from '../../../types';
import { assertArray } from '../../../utils/assertArray';
import { hasOwnProperty } from '../../../utils/hasOwnProperty';

export const fetchChannelBadges = async (): Promise<BadgeSet[] | null> => {
  try {
    const url = `${TWITCH_HELIX_URL}chat/badges?broadcaster_id=${Config.twitch.broadcaster_id}`;
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
    logger.error(error);
  }

  return null;
};
