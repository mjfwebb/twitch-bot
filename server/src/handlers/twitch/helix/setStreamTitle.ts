import { StatusCodes } from 'http-status-codes';
import fetch from 'node-fetch';
import Config from '../../../config';
import { TWITCH_HELIX_URL } from '../../../constants';
import { getCurrentAccessToken } from '../../../twitch';

export const setStreamTitle = async (title: string): Promise<void> => {
  if (Config.twitch) {
    try {
      const url = `${TWITCH_HELIX_URL}channels?broadcaster_id=${Config.twitch.broadcaster_id}`;
      const accessToken = getCurrentAccessToken();

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Client-Id': Config.twitch.client_id,
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
        }),
      });

      if (response.status === StatusCodes.NO_CONTENT) {
        return;
      } else {
        throw new Error(`setStreamTitle: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error(error);
    }
  }
};
