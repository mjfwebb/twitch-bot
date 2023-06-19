import Config from '../config';
import { TWITCH_HELIX_URL } from '../constants';
import { fetchWithRetry, getCurrentAccessToken } from '../twitch';
import type { EventSubCondition, EventsubSubscriptionType } from '../typings/twitchEvents';

export const eventSubscribe = async (sessionId: string, type: EventsubSubscriptionType, condition: EventSubCondition) => {
  try {
    const url = `${TWITCH_HELIX_URL}eventsub/subscriptions`;
    const accessToken = getCurrentAccessToken();

    const body = JSON.stringify({
      type,
      version: '1',
      condition,
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
};
