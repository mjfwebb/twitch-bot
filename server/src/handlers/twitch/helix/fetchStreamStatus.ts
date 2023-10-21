import fetch from 'node-fetch';
import { getCurrentAccessToken } from '../../../auth/twitch';
import { updateStreamStartedAt } from '../../../commands/helpers/updateStreamStartedAt';
import Config from '../../../config';
import { TWITCH_HELIX_URL } from '../../../constants';
import { logger } from '../../../logger';
import { StreamState, type StreamStatus } from '../../../streamState';
import { hasOwnProperty } from '../../../utils/hasOwnProperty';
import { fetchGameById } from './fetchGameById';

export const fetchStreamStatus = async (): Promise<StreamStatus> => {
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
          updateStreamStartedAt(data.started_at);
        }
        if (hasOwnProperty(data, 'game_id') && typeof data.game_id === 'string') {
          const game = await fetchGameById(data.game_id);
          if (game) {
            StreamState.category = game.name;
          }
        }
        return 'online';
      }
    }
  } catch (error) {
    logger.error(error);
  }

  return 'offline';
};
