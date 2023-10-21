import fetch from 'node-fetch';
import { getCurrentAccessToken } from '../../../auth/twitch';
import Config from '../../../config';
import { TWITCH_HELIX_URL } from '../../../constants';
import { logger } from '../../../logger';
import { StreamState } from '../../../streamState';
import { assertArray } from '../../../utils/assertArray';
import { hasOwnProperty } from '../../../utils/hasOwnProperty';

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
      if (
        result.data.length > 0 &&
        hasOwnProperty(result.data[0], 'broadcaster_id') &&
        typeof result.data[0].broadcaster_id === 'string' &&
        hasOwnProperty(result.data[0], 'broadcaster_login') &&
        typeof result.data[0].broadcaster_login === 'string' &&
        hasOwnProperty(result.data[0], 'broadcaster_name') &&
        typeof result.data[0].broadcaster_name === 'string' &&
        hasOwnProperty(result.data[0], 'broadcaster_language') &&
        typeof result.data[0].broadcaster_language === 'string' &&
        hasOwnProperty(result.data[0], 'game_id') &&
        typeof result.data[0].game_id === 'string' &&
        hasOwnProperty(result.data[0], 'game_name') &&
        typeof result.data[0].game_name === 'string' &&
        hasOwnProperty(result.data[0], 'title') &&
        typeof result.data[0].title === 'string' &&
        hasOwnProperty(result.data[0], 'delay') &&
        typeof result.data[0].delay === 'number' &&
        hasOwnProperty(result.data[0], 'tags') &&
        Array.isArray(result.data[0].tags)
      ) {
        StreamState.title = result.data[0].title;

        return result.data[0] as ChannelInfomation;
      }
    }
  } catch (error) {
    logger.error(error);
  }

  return null;
};
