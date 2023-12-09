// https://api.frankerfacez.com/v1/set/global

import Config from '../../config';
import { logger } from '../../logger';
import { frankerFaceZGlobalEmotesSchema, type FrankerFaceZGlobalEmotes } from './schemas';

export const fetchFrankerFaceZGlobalEmotes = async (): Promise<FrankerFaceZGlobalEmotes | null> => {
  if (Config.frankerFaceZ.enabled) {
    try {
      const url = `https://api.frankerfacez.com/v1/set/global`;
      const response = await fetch(url, { method: 'GET' });
      return await frankerFaceZGlobalEmotesSchema.parseAsync(await response.json());
    } catch (error) {
      logger.error(error);
    }
  }

  return null;
};
