/// https://api.betterttv.net/3/cached/users/{provider}/{providerId}

import fetch from 'node-fetch';
import Config from '../../config';
import { hasOwnProperty } from '../../utils/hasOwnProperty';

export type BttvUser = {
  id: string;
  bots: string[];
  avatar: string;
  channelEmotes: {
    id: string;
    code: string;
    imageType: string;
    animated: boolean;
    userId: string;
  }[];
  sharedEmotes: {
    id: string;
    code: string;
    imageType: string;
    animated: boolean;
    user: {
      id: string;
      name: string;
      displayName: string;
      providerId: string;
    };
  }[];
};

export const fetchBetterTTVUser = async (): Promise<BttvUser | null> => {
  if (Config.betterTTV) {
    try {
      const url = `https://api.betterttv.net/3/cached/users/${Config.betterTTV.provider}/${Config.betterTTV.providerId}`;
      const response = await fetch(url, { method: 'GET' });
      const data: unknown = await response.json();
      if (
        hasOwnProperty(data, 'id') &&
        hasOwnProperty(data, 'bots') &&
        hasOwnProperty(data, 'avatar') &&
        hasOwnProperty(data, 'channelEmotes') &&
        hasOwnProperty(data, 'sharedEmotes')
      ) {
        return data as BttvUser;
      }
    } catch (error) {
      console.error(error);
    }
  }
  return null;
};
