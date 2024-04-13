import { fetchWithRetry, getCurrentAccessToken } from '../../../../auth/twitch';
import Config from '../../../../config';
import { TWITCH_HELIX_URL } from '../../../../constants';
import { logger } from '../../../../logger';
import type { EventSubCondition, EventsubSubscriptionType } from '../../../../typings/twitchEvents';
import { hasOwnProperty } from '../../../../utils/hasOwnProperty';

export const eventSubscribe = async (sessionId: string, type: EventsubSubscriptionType, condition: EventSubCondition, version = '1') => {
  try {
    const url = `${TWITCH_HELIX_URL}eventsub/subscriptions`;
    const accessToken = getCurrentAccessToken();

    const body = JSON.stringify({
      type,
      version,
      condition,
      transport: {
        method: 'websocket',
        session_id: sessionId,
      },
    });

    const result = await fetchWithRetry(url, {
      method: 'POST',
      headers: {
        'Client-Id': Config.twitch.client_id,
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body,
    });

    if (hasOwnProperty(result, 'error')) {
      logger.error(`${type}: Error: ${JSON.stringify(result)}`);
    }
  } catch (error) {
    logger.error(error);
  }
};
