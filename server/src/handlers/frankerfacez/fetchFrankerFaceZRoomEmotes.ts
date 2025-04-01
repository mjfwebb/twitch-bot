// https://api.frankerfacez.com/v1/room/id/

import fetch from 'node-fetch';
import Config from '../../config';
import { logger } from '../../logger';
import { frankerFaceZRoomEmotesSchema, type FrankerFaceZRoomEmotes } from './schemas';

export const fetchFrankerFaceZRoomEmotes = async (): Promise<FrankerFaceZRoomEmotes | null> => {
  if (Config.frankerFaceZ.enabled) {
    try {
      const url = `https://api.frankerfacez.com/v1/room/id/${Config.twitch.broadcaster_id}`;
      const response = await fetch(url, { method: 'GET' });
      const json = await response.json();
      const result = frankerFaceZRoomEmotesSchema.safeParse(json);
      if (result.success) {
        logger.info(`Fetched FrankerFaceZ room emotes`);
        return result.data;
      } else {
        logger.error(`JSON response from FrankerFaceZ API (fetchFrankerFaceZRoomEmotes) is not valid. Error: ${result.error.message}`);
        return json as FrankerFaceZRoomEmotes;
      }
    } catch (error) {
      logger.error(error);
    }
  }

  return null;
};
