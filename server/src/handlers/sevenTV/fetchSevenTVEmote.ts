/// https://7tv.io/v3/emotes/{emote-id}

import fetch from 'node-fetch';
import { logger } from '../../logger';
import { sevenTVEmoteDataSchema, type SevenTVEmoteData } from './schemas';

export const fetchSevenTVEmote = async (emoteId: string): Promise<SevenTVEmoteData | null> => {
  try {
    const url = `https://7tv.io/v3/emotes/${emoteId}`;
    const response = await fetch(url, { method: 'GET' });
    const json = await response.json();
    const result = sevenTVEmoteDataSchema.safeParse(json);
    if (result.success) {
      logger.info(`Fetched 7TV emote ${emoteId}`);
      return result.data;
    } else {
      logger.error(`JSON response from 7TV API (fetchSevenTVEmote) is not valid. Error: ${result.error.message}`);
      return json as SevenTVEmoteData;
    }
  } catch (error) {
    logger.error(error);
  }
  return null;
};
