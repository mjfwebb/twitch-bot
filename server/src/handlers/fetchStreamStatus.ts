import fetch from 'node-fetch';
import Config from '../config';
import { TWITCH_HELIX_URL } from '../constants';
import { updateStreamStartedAt } from '../commands/helpers/updateStreamStartedAt';
import type { StreamState } from '../streamState';
import { getCurrentAccessToken } from '../twitch';
import { hasOwnProperty } from '../utils/hasOwnProperty';

export const fetchStreamStatus = async (): Promise<StreamState> => {
  if (Config.twitch) {
    try {
      const url = `${TWITCH_HELIX_URL}streams?user_login=${Config.twitch.account}`;
      const accessToken = getCurrentAccessToken();

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Client-Id': Config.twitch.client_id,
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const result: unknown = await response.json();
      if (hasOwnProperty(result, 'data') && Array.isArray(result.data)) {
        if (result.data.length > 0) {
          const data = result.data[0] as unknown;
          if (hasOwnProperty(data, 'started_at') && typeof data.started_at === 'string') {
            await updateStreamStartedAt(data.started_at);
          }
          return 'online';
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  return 'offline';
};
