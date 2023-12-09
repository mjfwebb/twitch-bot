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
      return bttvEmotesSchema.parseAsync(await response.json());
    } catch (error) {
      logger.error(error);
    }
  }

  return null;
};
