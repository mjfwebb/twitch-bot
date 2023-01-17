import fetch from 'node-fetch';
import Config from '../config';
import { TWITCH_HELIX_URL } from '../constants';
import { getCurrentAccessToken } from '../twitch';
import { assertArray } from '../utils/assertArray';
import { hasOwnProperty } from '../utils/hasOwnProperty';

type ChannelInfomation = {
  broadcaster_id: string;
  broadcaster_login: string;
  broadcaster_name: string;
  broadcaster_language: string;
  game_id: string;
  game_name: string;
  title: string;
  delay: number;
  tags: string[];
};

export const fetchChannelInformation = async (): Promise<ChannelInfomation | null> => {
  if (Config.twitch) {
    try {
      const url = `${TWITCH_HELIX_URL}channels?broadcaster_id=${Config.twitch.broadcaster_id}`;
      const accessToken = getCurrentAccessToken();

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Client-Id': Config.twitch.client_id,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result: unknown = await response.json();

      if (hasOwnProperty(result, 'data')) {
        assertArray(result.data);
        if (result.data.length > 0 && hasOwnProperty(result.data[0], 'broadcaster_id') && typeof result.data[0].broadcaster_id === 'string') {
          return result.data[0] as ChannelInfomation;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  return null;
};
