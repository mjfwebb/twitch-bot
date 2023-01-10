import Config from '../config';
import { eventSubscribe } from './eventSubscribe';

export const subscribeToRaids = async (sessionId: string) => {
  if (Config.twitch) {
    try {
      await eventSubscribe(sessionId, 'channel.raid', { to_broadcaster_user_id: Config.twitch.broadcaster_id });
    } catch (error) {
      console.error(error);
    }
  }
};
