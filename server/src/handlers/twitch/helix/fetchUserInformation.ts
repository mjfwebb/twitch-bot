import fetch from 'node-fetch';
import { getCurrentAccessToken } from '../../../auth/twitch';
import Config from '../../../config';
import { TWITCH_HELIX_URL } from '../../../constants';
import type { UserInformation } from '../../../types';
import { assertArray } from '../../../utils/assertArray';
import { hasOwnProperty } from '../../../utils/hasOwnProperty';

export const fetchUserInformationById = async (userId: string): Promise<UserInformation | null> => {
  if (!userId) {
    return null;
  }

  return await fetchUserInformation(`id=${userId}`);
};

export const fetchUserInformationByName = async (loginName: string): Promise<UserInformation | null> => {
  if (!loginName) {
    return null;
  }

  return await fetchUserInformation(`login=${loginName}`);
};

const fetchUserInformation = async (queryParams: string): Promise<UserInformation | null> => {
  try {
    const url = `${TWITCH_HELIX_URL}users?${queryParams}`;
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
      if (result.data.length > 0 && hasOwnProperty(result.data[0], 'display_name') && typeof result.data[0].display_name === 'string') {
        return result.data[0] as UserInformation;
      }
    }
  } catch (error) {
    console.error(error);
  }

  return null;
};
