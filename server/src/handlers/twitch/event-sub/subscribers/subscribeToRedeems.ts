import Config from '../../../../config';
import { logger } from '../../../../logger';
import { eventSubscribe } from './eventSubscribe';

export const subscribeToRedeems = async (sessionId: string) => {
  try {
    await eventSubscribe(sessionId, 'channel.channel_points_custom_reward_redemption.add', {
      broadcaster_user_id: Config.twitch.broadcaster_id,
    });
    await eventSubscribe(sessionId, 'channel.channel_points_custom_reward_redemption.update', {
      broadcaster_user_id: Config.twitch.broadcaster_id,
    });
  } catch (error) {
    logger.error(error);
  }
};
