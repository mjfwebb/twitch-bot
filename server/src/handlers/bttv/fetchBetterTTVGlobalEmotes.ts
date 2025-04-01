// https://api.betterttv.net/3/cached/emotes/global

import fetch from 'node-fetch';
import Config from '../../config';
import { logger } from '../../logger';
import type { BttvEmote } from './schemas';
import { bttvEmotesSchema } from './schemas';

export const fetchBetterTTVGlobalEmotes = async (): Promise<BttvEmote[] | null> => {
  if (Config.betterTTV.enabled) {
    try {
      const url = `https://api.betterttv.net/3/cached/emotes/global`;
      const response = await fetch(url, { method: 'GET' });
      const json = await response.json();
      const result = bttvEmotesSchema.safeParse(json);
      if (result.success) {
        logger.info(`Fetched BetterTTV global emotes`);
        return result.data;
      } else {
        logger.error(`JSON response from BetterTTV API is not valid. Error: ${result.error.message}`);
        return json as BttvEmote[];
      }
    } catch (error) {
      logger.error(error);
    }
  }

  return null;
};
