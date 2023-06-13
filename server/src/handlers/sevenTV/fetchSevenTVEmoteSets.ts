/// https://7tv.io/v3/emote-sets/{emote-set-id}

import fetch from 'node-fetch';
import { hasOwnProperty } from '../../utils/hasOwnProperty';

export type SevenTVEmoteSet = {
  id: string;
  name: string;
  flags: number;
  tags: string[];
  immutable: boolean;
  privileged: boolean;
  emotes: {
    id: string;
    name: string;
    flags: number;
    timestamp: number;
    actor_id: string;
    data: {
      id: string;
      name: string;
      flags: number;
      lifecycle: number;
      state: ('PERSONAL' | 'LISTED')[];
      listed: boolean;
      animated: boolean;
      owner: {
        id: string;
        username: string;
        display_name: string;
        avatar_url: string;
        style: unknown;
        roles: string[];
      };
      host: {
        url: string;
        files: {
          name: string;
          static_name: string;
          width: number;
          height: number;
          frame_count: number;
          size: number;
          format: 'AVIF' | 'WEBP';
        }[];
      };
    };
  }[];
};

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
