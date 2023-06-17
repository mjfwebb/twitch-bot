/// https://7tv.io/v3/users/{userId}

import fetch from 'node-fetch';
import Config from '../../config';
import { hasOwnProperty } from '../../utils/hasOwnProperty';
import type { SevenTVUser } from './types';

export const fetchSevenTVUser = async (): Promise<SevenTVUser | null> => {
  if (Config.sevenTV) {
    try {
      const url = `https://7tv.io/v3/users/${Config.sevenTV.userId}`;
      const response = await fetch(url, { method: 'GET' });
      const data: unknown = await response.json();
      if (
        hasOwnProperty(data, 'id') &&
        hasOwnProperty(data, 'username') &&
        hasOwnProperty(data, 'display_name') &&
        hasOwnProperty(data, 'created_at')
      ) {
        return data as SevenTVUser;
      }
    } catch (error) {
      console.error(error);
    }
  }
  return null;
};
