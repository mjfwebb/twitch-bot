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
      const json = await response.json();
      const result = sevenTVTwitchUserSchema.safeParse(json);
      if (result.success) {
        logger.info(`Fetched 7TV Twitch user`);
        return sevenTVTwitchUserSchema.parse(json);
      } else {
        logger.error(`JSON response from 7TV API (fetchSevenTVTwitchUser) is not valid. Error: ${result.error.message}`);
        return json as SevenTVTwitchUser;
      }
    } catch (error) {
      logger.error(error);
    }
  }

  return null;
};
