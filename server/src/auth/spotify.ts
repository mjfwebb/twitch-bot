import assert from 'assert';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import type { RequestInit } from 'node-fetch';
import fetch from 'node-fetch';
import open from 'open';
import pc from 'picocolors';
import type { SpotifyConfig } from '../config';
import Config, { updateConfigPart } from '../config';
import { SPOTIFY_AUTH_URL } from '../constants';
import { logger } from '../logger';
import { errorMessage } from '../utils/errorMessage';
import { hasOwnProperty } from '../utils/hasOwnProperty';
import { simplePluralise } from '../utils/simplePluralise';
import { getTokenFromFile, setTokenInFile } from './tokenManager';

export const getCurrentAccessToken = () => getTokenFromFile('spotify_access_token');

let rateLimitReached = false;

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

interface FetchWithRetryOptions {
  url: string;
  init?: RequestInit | undefined;
  attemptNumber?: number;
  shouldJSONParse?: boolean;
}

export const fetchWithRetry = async ({ url, init, attemptNumber = 0, shouldJSONParse = true }: FetchWithRetryOptions): Promise<unknown> => {
  if (rateLimitReached) {
    throw new Error('Spotify: API rate limit reached. Waiting for rate limit to be lifted.');
  }

  if (attemptNumber > 1) {
    throw new Error(`Spotify: Failed to perform fetch ${attemptNumber} ${simplePluralise('time', attemptNumber)} to Spotify API`);
  }
  const result = await fetch(url, init);

  if (result.status === StatusCodes.NO_CONTENT) {
    return;
  }

  if (result.status === StatusCodes.TOO_MANY_REQUESTS) {
    rateLimitReached = true;
    const retryAfter = result.headers.get('Retry-After');
    if (retryAfter) {
      const retryAfterSeconds = parseInt(retryAfter, 10);
      if (retryAfterSeconds) {
        logger.info(`Spotify: API rate limit reached. Waiting ${retryAfterSeconds} seconds before allowing another request.`);
        setTimeout(() => {
          rateLimitReached = false;
        }, retryAfterSeconds * 1000);
      }
    }
  }

  let data = null;
  try {
    if (shouldJSONParse) {
      data = await result.json();
    }
  } catch (error) {
    logger.error(`Spotify: Unable to parse JSON response from API. Error: ${errorMessage(error)}. Response: ${JSON.stringify(result)}`);

    throw error;
  }
  assertNotBadRequest(data);

  if (data !== null && hasOwnProperty(data, 'error') && hasOwnProperty(data.error, 'status')) {
    if (data.error.status === StatusCodes.UNAUTHORIZED) {
      // NOTE: Access token may have expired. Try to refresh.
      refreshAccessToken(Config.spotify).catch((e) => logger.error(e));

      return fetchWithRetry({
        url,
        init,
        attemptNumber: attemptNumber + 1,
        shouldJSONParse,
      });
    }
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
  if (data !== null && hasOwnProperty(data, 'error') && hasOwnProperty(data.error, 'status')) {
    assert(typeof data.error.status === 'number', 'Spotify: status in data response is not a number');
    if (data.error.status === StatusCodes.BAD_REQUEST) {
      assert(hasOwnProperty(data, 'message'), 'Spotify: message not found in data response');
      assert(typeof data.message === 'string', 'Spotify: message in data response is not a number');
      throw new Error(`Spotify: Bad request sent to API: ${data.message}`);
    }
  }
};

/**
 * Parses the new access token from the data response and updates the corresponding token in the file.
 * @param data - The data response object.
 * @returns The access token as a string.
 * @throws AssertionError if the access_token property is missing or not of the expected type.
 */
const parseNewAccessToken = (data: unknown): string => {
  assert(hasOwnProperty(data, 'access_token'), 'Spotify: access_token not found in data response');
  assert(typeof data.access_token === 'string', 'Spotify: access_token in data response is not a string');
  setTokenInFile('spotify_access_token', data.access_token);
  return data.access_token;
};

/**
 * Parses the new tokens from the data response and updates the corresponding tokens in the file.
 * @param data - The data response object.
 * @throws AssertionError if any of the required token properties are missing or not of the expected type.
 */
const saveNewTokens = (data: unknown): void => {
  assert(hasOwnProperty(data, 'access_token'), 'Spotify: access_token not found in data response');
  assert(hasOwnProperty(data, 'refresh_token'), 'Spotify: refresh_token not found in data response');
  assert(typeof data.access_token === 'string', 'Spotify: access_token in data response is not a string');
  assert(typeof data.refresh_token === 'string', 'Spotify: refresh_token in data response is not a string');
  setTokenInFile('spotify_access_token', data.access_token);
  setTokenInFile('spotify_refresh_token', data.refresh_token);
};

/**
 * Refreshes the Access Token from Spotify using the provided configuration.
 * @param spotifyConfig - The Spotify configuration object.
 * @returns A Promise that resolves to the refreshed Access Token as a string.
 * @throws Error if unable to refresh the Access Token from Spotify.
 */
const refreshAccessToken = async (spotifyConfig: SpotifyConfig): Promise<string> => {
  try {
    if (spotifyConfig === null) {
      throw new Error('Spotify configuration is missing.');
    }
    const refreshToken = getTokenFromFile('spotify_refresh_token');
    const url = `${SPOTIFY_AUTH_URL}api/token?client_id=${spotifyConfig.client_id}&client_secret=${
      spotifyConfig.client_secret
    }&grant_type=refresh_token&refresh_token=${encodeURIComponent(refreshToken)}`;
    const result = await fetch(url, {
      method: 'post',
      headers: {
        Authorization: `Basic ${btoa(`${spotifyConfig.client_id}:${spotifyConfig.client_secret}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const data: unknown = await result.json();
    assertNotBadRequest(data);
    return parseNewAccessToken(data);
  } catch (error) {
    throw new Error(`Spotify: Unable to use Refresh Token to obtain new Access Token. Error: ${errorMessage(error)}`);
  }
};

/**
 * Obtains a new Access Token from Spotify using the provided configuration.
 * @param spotifyConfig - The Spotify configuration object.
 * @throws Error if unable to obtain a new Access Token from Spotify.
 */
const getNewAccessToken = async (spotifyConfig: SpotifyConfig): Promise<void> => {
  try {
    if (spotifyConfig === null) {
      throw new Error('Spotify configuration is missing.');
    }
    const url = `${SPOTIFY_AUTH_URL}api/token?code=${spotifyConfig.auth_code}&grant_type=${spotifyConfig.grant_type}&redirect_uri=${spotifyConfig.redirect_uri}`;
    const result = await fetch(url, {
      method: 'post',
      headers: {
        Authorization: `Basic ${btoa(`${spotifyConfig.client_id}:${spotifyConfig.client_secret}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data: unknown = await result.json();

    console.log(data);

    assertNotBadRequest(data);
    saveNewTokens(data);
  } catch (error) {
    throw new Error(`Spotify: Unable to obtain new Access Token. Error: ${errorMessage(error)}`);
  }
};

/**
 * Retrieves the Spotify access token.
 * @throws Error if unable to get the Spotify Access Token.
 */
export const getSpotifyAccessToken = async (): Promise<void> => {
  const accessToken = getTokenFromFile('spotify_access_token');
  // If the access token is already set, we don't need to do anything
  if (accessToken) {
    return;
  }
  try {
    const refreshToken = getTokenFromFile('spotify_refresh_token');
    if (refreshToken) {
      // If we have a refresh token, we can use it to get a new access token
      await refreshAccessToken(Config.spotify);
    } else {
      // If we don't have a refresh token, we need to get a new access token
      await getNewAccessToken(Config.spotify);
    }
  } catch (error) {
    throw new Error(`Spotify: Unable to get Access Token. Error: ${errorMessage(error)}`);
  }
};

export const spotifyAuthCodeRouter = async () => {
  if (Config.spotify.client_id && !Config.spotify.auth_code) {
    const port = parseInt(Config.spotify.redirect_uri.split(':')[2]);

    logger.info(`Listening on port ${String(port)} for Spotify auth code`);

    express()
      .get('/', (req, res) => {
        if (req.query.code) {
          const code = req.query.code as string;

          updateConfigPart({
            part: 'spotify',
            property: 'auth_code',
            value: code,
          });

          res.send(
            'Hello from twitch-bot! Spotify Auth Code received and your configuration has been updated.' +
              'You may close this window. Please restart the bot.',
          );
        } else {
          res.send('Hello from twitch-bot! No Spotify Auth Code received. You may close this window.');
        }
      })
      .listen(port);

    logger.info(`Spotify: Getting Auth Code with scopes ${pc.green(`${Config.twitch.scopes.join(', ')}`)}`);
    await getSpotifyAuthCode();
  }
};

const getSpotifyAuthCode = async (): Promise<void> => {
  try {
    const scopes = Config.spotify.scopes.map((scope) => encodeURIComponent(scope)).join('+');
    const url = `${SPOTIFY_AUTH_URL}authorize?client_id=${Config.spotify.client_id}&response_type=code&redirect_uri=${Config.spotify.redirect_uri}&scope=${scopes}`;
    await open(url);
  } catch (error) {
    throw new Error(`Spotify: Unable to get Auth Code. Error: ${errorMessage(error)}`);
  }
};
