import Config from '../config';
import { eventSubscribe } from './eventSubscribe';

export const subscribeToRedeems = async (sessionId: string) => {
  try {
    await eventSubscribe(sessionId, 'channel.channel_points_custom_reward_redemption.add', {
      broadcaster_user_id: Config.twitch.broadcaster_id,
    });
  } catch (error) {
    console.error(error);
  }
};
