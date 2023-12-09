/// https://7tv.io/v3/emote-sets/{emote-set-id}

import fetch from 'node-fetch';
import { logger } from '../../logger';
import { sevenTVEmoteSetSchema, type SevenTVEmoteSet } from './schemas';

export const fetchSevenTVEmoteSet = async (emoteSetId: string): Promise<SevenTVEmoteSet | null> => {
  try {
    const url = `https://7tv.io/v3/emote-sets/${emoteSetId}`;
    const response = await fetch(url, { method: 'GET' });
    return await sevenTVEmoteSetSchema.parseAsync(await response.json());
  } catch (error) {
    logger.error(error);
  }
  return null;
};
