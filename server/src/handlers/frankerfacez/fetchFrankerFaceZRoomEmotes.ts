// https://api.frankerfacez.com/v1/room/id/

import Config from '../../config';
import { logger } from '../../logger';
import { frankerFaceZRoomEmotesSchema, type FrankerFaceZRoomEmotes } from './schemas';

export const fetchFrankerFaceZRoomEmotes = async (): Promise<FrankerFaceZRoomEmotes | null> => {
  if (Config.frankerFaceZ.enabled) {
    try {
      const url = `https://api.frankerfacez.com/v1/room/id/${Config.twitch.broadcaster_id}`;
      const response = await fetch(url, { method: 'GET' });
      return await frankerFaceZRoomEmotesSchema.parseAsync(await response.json());
    } catch (error) {
      logger.error(error);
    }
  }

  return null;
};
