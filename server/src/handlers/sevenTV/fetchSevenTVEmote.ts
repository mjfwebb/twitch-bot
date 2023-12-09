/// https://7tv.io/v3/emotes/{emote-id}

import fetch from 'node-fetch';
import { logger } from '../../logger';
import { sevenTVEmoteDataSchema, type SevenTVEmoteData } from './schemas';

export const fetchSevenTVEmote = async (emoteId: string): Promise<SevenTVEmoteData | null> => {
  try {
    const url = `https://7tv.io/v3/emotes/${emoteId}`;
    const response = await fetch(url, { method: 'GET' });
    return await sevenTVEmoteDataSchema.parseAsync(await response.json());
  } catch (error) {
    logger.error(error);
  }
  return null;
};
