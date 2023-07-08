import fetch from 'node-fetch';
import { getCurrentAccessToken } from '../../../auth/twitch';
import Config from '../../../config';
import { TWITCH_HELIX_URL } from '../../../constants';
import { logger } from '../../../logger';
import { assertArray } from '../../../utils/assertArray';
import { hasOwnProperty } from '../../../utils/hasOwnProperty';

type Chatter = {
  user_id: string;
  user_login: string;
  user_name: string;
};

export const fetchChatters = async (): Promise<Chatter[]> => {
  try {
    const url = `${TWITCH_HELIX_URL}chat/chatters?broadcaster_id=${Config.twitch.broadcaster_id}&moderator_id=${Config.twitch.broadcaster_id}`;
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
      const onlineChatters: unknown = result.data;
      assertArray(onlineChatters);
      return onlineChatters as Chatter[];
    }
  } catch (error) {
    logger.error(error);
  }

  return [];
};
