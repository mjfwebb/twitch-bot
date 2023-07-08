// https://api.twitch.tv/helix/channel_points/custom_rewards

import Config from '../../../../config';
import { logger } from '../../../../logger';
import { eventSubscribe } from './eventSubscribe';

export const subscribeToFollows = async (sessionId: string) => {
  try {
    await eventSubscribe(sessionId, 'channel.follow', { broadcaster_user_id: Config.twitch.broadcaster_id });
  } catch (error) {
    logger.error(error);
  }
};
