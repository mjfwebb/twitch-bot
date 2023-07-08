// https://api.frankerfacez.com/v1/room/id/

import Config from '../../config';
import { logger } from '../../logger';
import { hasOwnProperty } from '../../utils/hasOwnProperty';
import type { FrankerFaceZEmoteSets } from './types';

type FrankerFaceZRoomEmotes = {
  sets: FrankerFaceZEmoteSets;
};

export const fetchFrankerFaceZRoomEmotes = async (): Promise<FrankerFaceZRoomEmotes | null> => {
  if (Config.frankerFaceZ.enabled) {
    try {
      const url = `https://api.frankerfacez.com/v1/room/id/${Config.frankerFaceZ.broadcaster_id}`;
      const response = await fetch(url, { method: 'GET' });
      const data: unknown = await response.json();

      if (hasOwnProperty(data, 'sets')) {
        return data as FrankerFaceZRoomEmotes;
      }
    } catch (error) {
      logger.error(error);
    }
  }

  return null;
};
