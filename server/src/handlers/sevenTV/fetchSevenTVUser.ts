/// https://7tv.io/v3/users/{userId}

import fetch from 'node-fetch';
import Config from '../../config';
import { hasOwnProperty } from '../../utils/hasOwnProperty';

export type SevenTVUser = {
  id: string;
  username: string;
  display_name: string;
  created_at: number;
  avatar_url: string;
  style: unknown;
  emote_sets: {
    id: string;
    name: string;
    flags: number;
    tags: string[];
    capacity: number;
  }[];
  editors: {
    id: string;
    permissions: number;
    visible: boolean;
    added_at: number;
  }[];
  roles: string[];
  connections: {
    id: string;
    platform: string;
    username: string;
    display_name: string;
    linked_at: number;
    emote_capacity: number;
    emote_set_id: null;
    emote_set: {
      id: string;
      name: string;
      flags: number;
      tags: string[];
      immutable: boolean;
      privileged: boolean;
      capacity: number;
      owner: null;
    };
  }[];
};

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
