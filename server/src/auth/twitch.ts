import assert from 'assert';
import { StatusCodes } from 'http-status-codes';
import type { RequestInit } from 'node-fetch';
import fetch from 'node-fetch';
import type { TwitchConfig } from '../config';
import Config from '../config';
import { TWITCH_AUTH_URL } from '../constants';
import { errorMessage } from '../utils/errorMessage';
import { hasOwnProperty } from '../utils/hasOwnProperty';
import { getTokenFromFile, setTokenInFile } from './tokenManager';

/**
 * Validates the access token by making a request to the Twitch authentication API.
 * @param accessToken - The access token to validate.
 * @returns A boolean indicating whether the access token is valid.
 */
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

/**
 * Performs a fetch request to the specified URL with optional request initialization parameters, with retry logic.
 * @param url - The URL to fetch from.
 * @param init - Optional request initialization parameters.
 * @param attemptNumber - The number of attempts made (used for retry logic).
 * @returns A Promise that resolves to the fetched data as an unknown type.
 * @throws Error if the fetch operation fails after the maximum number of attempts.
 * @remarks To support checking the response (which requires using result.json()) we pass back the parsed data response, instead of the whole Reponse.
 * This seems reasonable since all interactions with the API always want the JSON data anyway.
 */
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

/**
 * Checks the response data for errors.
 * If the response has a status code indicating a bad request, throws an error with the corresponding message.
 * If the response has a status code indicating unauthorized access, tries to refresh the access token.
 * @param data The response data to be checked for errors
 * @returns A boolean indicating whether an error was encountered
 */
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

/**
 * Uses the Refresh Token to obtain a new Access Token from Twitch.
 * @param twitchConfig The configuration object for Twitch
 * @returns A promise that resolves to the new Access Token
 * @throws Error if unable to use the Refresh Token to obtain the new Access Token
 */
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

/**
 * Obtains a new Access Token from Twitch using the provided Twitch configuration.
 * @param twitchConfig The configuration object for Twitch
 * @returns A promise that resolves to the new Access Token
 * @throws Error if unable to obtain the new Access Token
 */
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

/**
 * Retrieves the Twitch Access Token.
 * If the current access token is invalid, it checks for a refresh token and either refreshes the access token or obtains a new one.
 * @param twitchConfig The configuration object for Twitch
 * @returns A promise that resolves to the Twitch Access Token
 * @throws Error if unable to get the Twitch Access Token
 */
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
