import Config from '../config';
import { eventSubscribe } from './eventSubscribe';

export const subscribeToSubscriptions = async (sessionId: string) => {
  if (Config.twitch) {
    try {
      await eventSubscribe(sessionId, 'channel.subscribe', { broadcaster_user_id: Config.twitch.broadcaster_id });
    } catch (error) {
      console.error(error);
    }
  }
};
