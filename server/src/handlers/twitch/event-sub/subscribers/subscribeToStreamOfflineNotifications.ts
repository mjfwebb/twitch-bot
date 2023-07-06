import Config from '../../../../config';
import { eventSubscribe } from './eventSubscribe';

export const subscribeToStreamOfflineNotifications = async (sessionId: string) => {
  try {
    await eventSubscribe(sessionId, 'stream.offline', { broadcaster_user_id: Config.twitch.broadcaster_id });
  } catch (error) {
    console.error(error);
  }
};
