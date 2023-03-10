// https://api.twitch.tv/helix/channel_points/custom_rewards

import Config from '../config';
import { eventSubscribe } from './eventSubscribe';

export const subscribeToFollows = async (sessionId: string) => {
  if (Config.twitch) {
    try {
      await eventSubscribe(sessionId, 'channel.follow', { broadcaster_user_id: Config.twitch.broadcaster_id });
    } catch (error) {
      console.error(error);
    }
  }
};
