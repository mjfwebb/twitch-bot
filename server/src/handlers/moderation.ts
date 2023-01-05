// https://api.twitch.tv/helix/moderation/

import Config from '../config';
import { TWITCH_HELIX_URL } from '../constants';
import { fetchWithRetry, getCurrentAccessToken } from '../twitch';

export const banUser = async (userId: string) => {
  if (Config.twitch) {
    try {
      const url = `${TWITCH_HELIX_URL}moderation/bans?broadcaster_id=${Config.twitch.broadcaster_id}&moderator_id=${Config.twitch.broadcaster_id}`;
      const accessToken = getCurrentAccessToken();

      const body = JSON.stringify({
        data: {
          user_id: userId,
        },
      });

      await fetchWithRetry(url, {
        method: 'POST',
        headers: {
          'Client-Id': Config.twitch.client_id,
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body,
      });
    } catch (error) {
      console.error(error);
    }
  }
};

export const unbanUser = async (userId: string) => {
  if (Config.twitch) {
    try {
      const url = `${TWITCH_HELIX_URL}moderation/bans?broadcaster_id=${Config.twitch.broadcaster_id}&moderator_id=${Config.twitch.broadcaster_id}&user_id=${userId}`;
      const accessToken = getCurrentAccessToken();

      await fetchWithRetry(url, {
        method: 'DELETE',
        headers: {
          'Client-Id': Config.twitch.client_id,
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
};
