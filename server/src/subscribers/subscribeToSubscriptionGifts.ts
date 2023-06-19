import Config from '../config';
import { eventSubscribe } from './eventSubscribe';

export const subscribeToSubscriptionGifts = async (sessionId: string) => {
  try {
    await eventSubscribe(sessionId, 'channel.subscription.gift', { broadcaster_user_id: Config.twitch.broadcaster_id });
  } catch (error) {
    console.error(error);
  }
};
