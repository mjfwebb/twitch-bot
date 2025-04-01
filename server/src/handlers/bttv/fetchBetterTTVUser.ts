/// https://api.betterttv.net/3/cached/users/{provider}/{providerId}

import fetch from 'node-fetch';
import Config from '../../config';
import { logger } from '../../logger';
import { bttvUserSchema, type BttvUser } from './schemas';

export const fetchBetterTTVUser = async (): Promise<BttvUser | null> => {
  if (Config.betterTTV.enabled) {
    try {
      const url = `https://api.betterttv.net/3/cached/users/twitch/${Config.twitch.broadcaster_id}`;
      const response = await fetch(url, { method: 'GET' });
      const json = await response.json();
      const result = bttvUserSchema.safeParse(json);
      if (result.success) {
        logger.info(`Fetched BetterTTV user`);
        return result.data;
      } else {
        logger.error(`JSON response from BetterTTV API is not valid. Error: ${result.error.message}`);
        return json as BttvUser;
      }
    } catch (error) {
      logger.error(error);
    }
  }

  return null;
};
