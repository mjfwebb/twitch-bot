import type { RequestInit } from 'node-fetch';
import fetch from 'node-fetch';
import assert from 'assert';
import { StatusCodes } from 'http-status-codes';
import { hasOwnProperty } from './utils/hasOwnProperty';
import { errorMessage } from './utils/errorMessage';
import { getTokenFromFile, setTokenInFile } from './tokenManager';
import type { TwitchConfig } from './config';
import Config from './config';
import { TWITCH_AUTH_URL } from './constants';

const validateAccessToken = async (accessToken: string) => {
  const url = `${TWITCH_AUTH_URL}validate`;
  const result = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `OAuth ${accessToken}`,
    },
  });
  return result.status === StatusCodes.OK;
};

export const getCurrentAccessToken = () => getTokenFromFile('twitch_access_token');

// To support checking the response (which requires using result.json())
// we pass back the parsed data response, instead of the whole Reponse.
// This seems reasonable since all interactions with the API always want
// the JSON data anyway.
export const fetchWithRetry = async (url: string, init?: RequestInit | undefined, attemptNumber = 0): Promise<unknown> => {
  if (attemptNumber > 2) {
    throw new Error(`Failed to perform fetch ${attemptNumber} times to Twitch API`);
  }
  const result = await fetch(url, init);

  if (result.status === StatusCodes.NO_CONTENT) {
    return;
  }

  const data: unknown = await result.json();
  const shouldRetry = checkResponseForErrors(data);
  if (shouldRetry) {
    return fetchWithRetry(url, init, attemptNumber + 1);
  } else {
    return data;
  }
};

export const checkResponseForErrors = (data: unknown): boolean => {
  if (hasOwnProperty(data, 'status')) {
    assert(typeof data.status === 'number', 'status in data response is not a number');
    if (data.status === StatusCodes.BAD_REQUEST) {
      assert(hasOwnProperty(data, 'message'), 'message not found in data response');
      assert(typeof data.message === 'string', 'message in data response is not a number');
      throw new Error(`Bad request: ${data.message}`);
    }

    if (data.status === StatusCodes.UNAUTHORIZED) {
      // NOTE: Access token may have expired. Try to refresh.
      refreshAccessToken(Config.twitch).catch((e) => console.error(e));
      return true;
    }
  }
  return false;
};

const parseNewTokens = (data: unknown): string => {
  assert(hasOwnProperty(data, 'access_token'), 'access_token not found in data response');
  assert(hasOwnProperty(data, 'refresh_token'), 'refresh_token not found in data response');
  assert(typeof data.access_token === 'string', 'access_token in data response is not a string');
  assert(typeof data.refresh_token === 'string', 'refresh_token in data response is not a string');
  setTokenInFile('twitch_access_token', data.access_token);
  setTokenInFile('twitch_refresh_token', data.refresh_token);
  return data.access_token;
};

const refreshAccessToken = async (twitchConfig: TwitchConfig): Promise<string> => {
  try {
    const refreshToken = getTokenFromFile('twitch_refresh_token');
    const url = `${TWITCH_AUTH_URL}token?client_id=${twitchConfig.client_id}&client_secret=${
      twitchConfig.client_secret
    }&grant_type=refresh_token&refresh_token=${encodeURIComponent(refreshToken)}`;
    const result = await fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const data: unknown = await result.json();
    checkResponseForErrors(data);
    return parseNewTokens(data);
  } catch (error) {
    throw new Error(`Unable to use Refresh Token to obtain new Access Token from Twitch. Error: ${errorMessage(error)}`);
  }
};

const getNewAccessToken = async (twitchConfig: TwitchConfig): Promise<string> => {
  try {
    const url = `${TWITCH_AUTH_URL}token?client_id=${twitchConfig.client_id}&client_secret=${twitchConfig.client_secret}&code=${twitchConfig.auth_code}&grant_type=${twitchConfig.grant_type}&redirect_uri=${twitchConfig.redirect_uri}`;
    const result = await fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data: unknown = await result.json();
    checkResponseForErrors(data);
    return parseNewTokens(data);
  } catch (error) {
    throw new Error(`Unable to obtain new Access Token from Twitch. Error: ${errorMessage(error)}`);
  }
};

export const getTwitchAccessToken = async (twitchConfig: TwitchConfig): Promise<string> => {
  const accessToken = getTokenFromFile('twitch_access_token');
  try {
    if (!(await validateAccessToken(accessToken))) {
      const refreshToken = getTokenFromFile('twitch_refresh_token');
      if (refreshToken) {
        return await refreshAccessToken(twitchConfig);
      } else {
        return await getNewAccessToken(twitchConfig);
      }
    } else {
      return accessToken;
    }
  } catch (error) {
    throw new Error(`Unable to get Twitch Access Token. Error: ${errorMessage(error)}`);
  }
};
