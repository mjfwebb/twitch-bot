/// https://7tv.io/v3/emote-sets/{emote-set-id}

import fetch from 'node-fetch';
import { logger } from '../../logger';
import { sevenTVEmoteSetSchema, type SevenTVEmoteSet } from './schemas';

export const fetchSevenTVEmoteSet = async (emoteSetId: string): Promise<SevenTVEmoteSet | null> => {
  try {
    const url = `https://7tv.io/v3/emote-sets/${emoteSetId}`;
    const response = await fetch(url, { method: 'GET' });
    const json = await response.json();
    const result = sevenTVEmoteSetSchema.safeParse(json);
    if (result.success) {
      logger.info(`Fetched 7TV emote set ${emoteSetId}`);
      return result.data;
    } else {
      logger.error(`JSON response from 7TV API (fetchSevenTVEmoteSet) is not valid. Error: ${result.error.message}`);
      return json as SevenTVEmoteSet;
    }
  } catch (error) {
    logger.error(error);
  }
  return null;
};
