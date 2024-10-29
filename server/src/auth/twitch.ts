import assert from 'assert';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import type { RequestInit } from 'node-fetch';
import fetch from 'node-fetch';
import open from 'open';
import pc from 'picocolors';
import type { TwitchConfig } from '../config';
import Config, { updateConfigPart } from '../config';
import { TWITCH_AUTH_URL } from '../constants';
import { logger } from '../logger';
import { errorMessage } from '../utils/errorMessage';
import { hasOwnProperty } from '../utils/hasOwnProperty';
import { simplePluralise } from '../utils/simplePluralise';
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
export const fetchWithRetry = async (url: string, init?: RequestInit, attemptNumber = 0): Promise<unknown> => {
  if (attemptNumber > 2) {
    throw new Error(`Twitch: Failed to perform fetch ${attemptNumber} ${simplePluralise('time', attemptNumber)} to API`);
  }
  const result = await fetch(url, init);

  if (result.status === StatusCodes.NO_CONTENT) {
    return;
  }

  const data: unknown = await result.json();
  assertNotBadRequest(data);

  if (result.status === StatusCodes.UNAUTHORIZED) {
    // NOTE: We got a 401 Unauthorized response. The Access token may have expired. Try to refresh then retry the request.
    await refreshAccessToken(Config.twitch).catch((e) => logger.error(e));
    return fetchWithRetry(url, init, attemptNumber + 1);
  } else {
    return data;
  }
};

/**
 * Checks if the data response contains a status code of 400 Bad Request and throws an error if it does.
 * @param data
 * @throws Error if the data response contains a status code of 400 Bad Request
 */
const assertNotBadRequest = (data: unknown): void => {
  if (hasOwnProperty(data, 'status')) {
    assert(typeof data.status === 'number', 'Twitch: status in data response is not a number');
    if (data.status === StatusCodes.BAD_REQUEST) {
      assert(hasOwnProperty(data, 'message'), 'Twitch: message not found in data response');
      assert(typeof data.message === 'string', 'Twitch: message in data response is not a number');
      throw new Error(`Twitch: Bad request sent to API: ${data.message}`);
    }
  }
};

/**
 * Saves the new tokens in the token files.
 * @param data The data response from the Twitch API.
 */
const saveNewTokens = (data: unknown): void => {
  assert(hasOwnProperty(data, 'access_token'), 'Twitch access_token not found in data response');
  assert(hasOwnProperty(data, 'refresh_token'), 'Twitch refresh_token not found in data response');
  assert(typeof data.access_token === 'string', 'Twitch access_token in data response is not a string');
  assert(typeof data.refresh_token === 'string', 'Twitch refresh_token in data response is not a string');
  setTokenInFile('twitch_access_token', data.access_token);
  setTokenInFile('twitch_refresh_token', data.refresh_token);
};

/**
 * Uses the Refresh Token to obtain a new Access Token from Twitch.
 * @param twitchConfig The configuration object for Twitch
 * @throws Error if unable to use the Refresh Token to obtain the new Access Token
 */
const refreshAccessToken = async (twitchConfig: TwitchConfig): Promise<void> => {
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
    assertNotBadRequest(data);
    saveNewTokens(data);
  } catch (error) {
    throw new Error(`Twitch: Unable to use Refresh Token to obtain new Access Token. Error: ${errorMessage(error)}`);
  }
};

/**
 * Obtains a new Access Token from Twitch using the provided Twitch configuration.
 * @param twitchConfig The configuration object for Twitch
 * @throws Error if unable to obtain the new Access Token
 */
const getNewAccessToken = async (twitchConfig: TwitchConfig): Promise<void> => {
  try {
    const url = `${TWITCH_AUTH_URL}token?client_id=${twitchConfig.client_id}&client_secret=${twitchConfig.client_secret}&code=${twitchConfig.auth_code}&grant_type=${twitchConfig.grant_type}&redirect_uri=${twitchConfig.redirect_uri}`;
    const result = await fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data: unknown = await result.json();
    assertNotBadRequest(data);
    saveNewTokens(data);
  } catch (error) {
    throw new Error(`Twitch: Unable to obtain new Access Token. Error: ${errorMessage(error)}`);
  }
};

/**
 * Retrieves the Twitch Access Token.
 * If the current access token is invalid, it checks for a refresh token and either refreshes the access token or obtains a new one.
 * @param twitchConfig The configuration object for Twitch
 * @throws Error if unable to get the Twitch Access Token
 */
export const getTwitchAccessToken = async (twitchConfig: TwitchConfig): Promise<void> => {
  const accessToken = getTokenFromFile('twitch_access_token');
  try {
    if (!(await validateAccessToken(accessToken))) {
      const refreshToken = getTokenFromFile('twitch_refresh_token');
      if (refreshToken) {
        await refreshAccessToken(twitchConfig);
      } else {
        await getNewAccessToken(twitchConfig);
      }
    }
  } catch (error) {
    throw new Error(`Twtich: Unable to get Access Token. Error: ${errorMessage(error)}`);
  }
};

/**
 * Starts a server to handle the Twitch auth code.
 * If in the config file the Twitch client ID is set and the auth code is not set, it opens a browser window to get the auth code.
 */
export const twitchAuthCodeRouter = async () => {
  if (Config.twitch.client_id && !Config.twitch.auth_code) {
    const port = parseInt(Config.twitch.redirect_uri.split(':')[2]);

    logger.info(`Listening on port ${String(port)} for Twitch auth code`);

    express()
      .get('/', (req, res) => {
        if (req.query.code) {
          const code = req.query.code as string;

          updateConfigPart({
            part: 'twitch',
            property: 'auth_code',
            value: code,
          });

          res.send(
            'Hello from twitch-bot! Twitch auth code received and your configuration has been updated.' +
              'You can safely close this window. Please restart the bot server.',
          );
          logger.info(
            `Twitch: Please restart the bot server. A browser window was opened and the Twitch Auth Code was received, allowing the bot to update your configuration with the new auth_code value. You can safely close this browser window.`,
          );
        } else {
          res.send('Hello from twitch-bot! No Twitch auth code received. You can safelyclose this window.');
          logger.warn(
            `Twitch: No Auth Code received. A browser window was opened and the Twitch auth code was not received for some reason. You can safely close this browser window.`,
          );
        }
      })
      .listen(port);

    logger.info(`Twitch: Getting Auth Code with scopes ${pc.green(`${Config.twitch.scopes.join(', ')}`)}`);
    await getTwitchAuthCode();
  }
};

const getTwitchAuthCode = async (): Promise<void> => {
  try {
    const scopes = Config.twitch.scopes.map((scope) => encodeURIComponent(scope)).join('+');
    const url = `${TWITCH_AUTH_URL}authorize?response_type=code&client_id=${Config.twitch.client_id}&redirect_uri=${Config.twitch.redirect_uri}&scope=${scopes}`;
    await open(url);
  } catch (error) {
    throw new Error(`Twitch: Unable to get Auth Code. Error: ${errorMessage(error)}`);
  }
};
