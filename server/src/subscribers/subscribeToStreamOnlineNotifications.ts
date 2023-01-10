import Config from '../config';
import { eventSubscribe } from './eventSubscribe';

export const subscribeToStreamOnlineNotifications = async (sessionId: string) => {
  if (Config.twitch) {
    try {
      await eventSubscribe(sessionId, 'stream.online', { broadcaster_user_id: Config.twitch.broadcaster_id });
    } catch (error) {
      console.error(error);
    }
  }
};
