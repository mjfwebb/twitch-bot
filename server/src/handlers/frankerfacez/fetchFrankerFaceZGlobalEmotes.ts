// https://api.frankerfacez.com/v1/set/global

import Config from '../../config';
import { logger } from '../../logger';
import { hasOwnProperty } from '../../utils/hasOwnProperty';
import type { FrankerFaceZEmoteSets } from './types';

type FrankerFaceZGlobalEmotes = {
  default_sets: number[];
  sets: FrankerFaceZEmoteSets;
};

export const fetchFrankerFaceZGlobalEmotes = async (): Promise<FrankerFaceZGlobalEmotes | null> => {
  if (Config.frankerFaceZ.enabled) {
    try {
      const url = `https://api.frankerfacez.com/v1/set/global`;
      const response = await fetch(url, { method: 'GET' });
      const data: unknown = await response.json();

      if (hasOwnProperty(data, 'default_sets') && hasOwnProperty(data, 'sets')) {
        return data as FrankerFaceZGlobalEmotes;
      }
    } catch (error) {
      logger.error(error);
    }
  }

  return null;
};
