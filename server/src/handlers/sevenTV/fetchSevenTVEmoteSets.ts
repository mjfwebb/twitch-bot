/// https://7tv.io/v3/emote-sets/{emote-set-id}

import fetch from 'node-fetch';
import { hasOwnProperty } from '../../utils/hasOwnProperty';
import type { SevenTVEmoteSet } from './types';

export const fetchSevenTVEmoteSet = async (emoteSetId: string): Promise<SevenTVEmoteSet | null> => {
  try {
    const url = `https://7tv.io/v3/emote-sets/${emoteSetId}`;
    const response = await fetch(url, { method: 'GET' });
    const data: unknown = await response.json();
    if (hasOwnProperty(data, 'id') && hasOwnProperty(data, 'name') && hasOwnProperty(data, 'flags') && hasOwnProperty(data, 'emotes')) {
      return data as SevenTVEmoteSet;
    }
  } catch (error) {
    console.error(error);
  }
  return null;
};
