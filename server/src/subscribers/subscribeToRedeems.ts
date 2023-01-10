// https://api.twitch.tv/helix/channel_points/custom_rewards

import Config from '../config';
import { TWITCH_HELIX_URL } from '../constants';
import { fetchWithRetry, getCurrentAccessToken } from '../twitch';

export const subscribeToRedeems = async (sessionId: string) => {
  if (Config.twitch) {
    try {
      const url = `${TWITCH_HELIX_URL}eventsub/subscriptions`;
      const accessToken = getCurrentAccessToken();

      const body = JSON.stringify({
        type: 'channel.channel_points_custom_reward_redemption.add',
        version: '1',
        condition: { broadcaster_user_id: Config.twitch.broadcaster_id },
        transport: {
          method: 'websocket',
          session_id: sessionId,
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
