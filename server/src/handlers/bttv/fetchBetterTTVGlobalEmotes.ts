// https://api.betterttv.net/3/cached/emotes/global

import fetch from 'node-fetch';
import Config from '../../config';
import { logger } from '../../logger';
import { hasOwnProperty } from '../../utils/hasOwnProperty';
import type { BttvEmote } from './types';

export const fetchBetterTTVGlobalEmotes = async (): Promise<BttvEmote[] | null> => {
  if (Config.betterTTV.enabled) {
    try {
      const url = `https://api.betterttv.net/3/cached/emotes/global`;
      const response = await fetch(url, { method: 'GET' });
      const data: unknown = await response.json();

      if (
        Array.isArray(data) &&
        hasOwnProperty(data[0], 'id') &&
        hasOwnProperty(data[0], 'code') &&
        hasOwnProperty(data[0], 'imageType') &&
        hasOwnProperty(data[0], 'animated') &&
        hasOwnProperty(data[0], 'userId')
      ) {
        return data as BttvEmote[];
      }
    } catch (error) {
      logger.error(error);
    }
  }

  return null;
};
