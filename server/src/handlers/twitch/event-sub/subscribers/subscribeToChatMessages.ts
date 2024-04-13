import Config from '../../../../config';
import { logger } from '../../../../logger';
import { eventSubscribe } from './eventSubscribe';

export const subscribeToChatMessages = async (sessionId: string) => {
  try {
    await eventSubscribe(sessionId, 'channel.chat.message', {
      broadcaster_user_id: Config.twitch.broadcaster_id,
      user_id: Config.twitch.broadcaster_id,
    });
  } catch (error) {
    logger.error(error);
  }
};
