// https://api.frankerfacez.com/v1/set/global

import fetch from 'node-fetch';
import Config from '../../config';
import { logger } from '../../logger';
import { frankerFaceZGlobalEmotesSchema, type FrankerFaceZGlobalEmotes } from './schemas';

export const fetchFrankerFaceZGlobalEmotes = async (): Promise<FrankerFaceZGlobalEmotes | null> => {
  if (Config.frankerFaceZ.enabled) {
    try {
      const url = `https://api.frankerfacez.com/v1/set/global`;
      const response = await fetch(url, { method: 'GET' });
      const json = await response.json();
      const result = frankerFaceZGlobalEmotesSchema.safeParse(json);
      if (result.success) {
        logger.info(`Fetched FrankerFaceZ global emotes`);
        return result.data;
      } else {
        logger.error(`JSON response from FrankerFaceZ API (fetchFrankerFaceZGlobalEmotes) is not valid. Error: ${result.error.message}`);
        return json as FrankerFaceZGlobalEmotes;
      }
    } catch (error) {
      logger.error(error);
    }
  }

  return null;
};
