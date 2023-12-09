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
      return await bttvUserSchema.parseAsync(await response.json());
    } catch (error) {
      logger.error(error);
    }
  }

  return null;
};
