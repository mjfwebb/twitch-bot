import Config from '../../../../config';
import { logger } from '../../../../logger';
import { eventSubscribe } from './eventSubscribe';

export const subscribeToStreamOnlineNotifications = async (sessionId: string) => {
  try {
    await eventSubscribe(sessionId, 'stream.online', { broadcaster_user_id: Config.twitch.broadcaster_id });
  } catch (error) {
    logger.error(error);
  }
};
