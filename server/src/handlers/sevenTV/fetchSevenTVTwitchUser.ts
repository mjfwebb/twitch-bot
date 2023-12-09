/// https://7tv.io/v3/users/twitch/{user-id}

import fetch from 'node-fetch';
import Config from '../../config';
import { logger } from '../../logger';
import { sevenTVTwitchUserSchema, type SevenTVTwitchUser } from './schemas';

export const fetchSevenTVTwitchUser = async (): Promise<SevenTVTwitchUser | null> => {
  if (Config.sevenTV.enabled) {
    try {
      const url = `https://7tv.io/v3/users/twitch/${Config.twitch.broadcaster_id}`;
      const response = await fetch(url, { method: 'GET' });
      return await sevenTVTwitchUserSchema.parseAsync(await response.json());
    } catch (error) {
      logger.error(error);
    }
  }

  return null;
};
