import type { RequestInit } from 'node-fetch';
import fetch from 'node-fetch';
import assert from 'assert';
import { StatusCodes } from 'http-status-codes';
import { hasOwnProperty } from './utils/hasOwnProperty';
import { errorMessage } from './utils/errorMessage';
import { getTokenFromFile, setTokenInFile } from './tokenManager';
import type { SpotifyConfig } from './config';
import Config from './config';
import { SPOTIFY_AUTH_URL } from './constants';

export const getCurrentAccessToken = () => getTokenFromFile('spotify_access_token');

// To support checking the response (which requires using result.json())
// we pass back the parsed data response, instead of the whole Reponse.
// This seems reasonable since all interactions with the API always want
// the JSON data anyway.
export const fetchWithRetry = async (url: string, init?: RequestInit | undefined, attemptNumber = 0): Promise<unknown> => {
  if (attemptNumber > 1) {
    throw new Error(`Failed to perform fetch ${attemptNumber} times to Spotify API`);
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
  if (hasOwnProperty(data, 'error') && hasOwnProperty(data.error, 'status')) {
    assert(typeof data.error.status === 'number', 'status in data response is not a number');
    if (data.error.status === StatusCodes.BAD_REQUEST) {
      assert(hasOwnProperty(data, 'message'), 'message not found in data response');
      assert(typeof data.message === 'string', 'message in data response is not a number');
      throw new Error(`Bad request: ${data.message}`);
    }

    if (data.error.status === StatusCodes.UNAUTHORIZED) {
      // NOTE: Access token may have expired. Try to refresh.
      refreshAccessToken(Config.spotify).catch((e) => console.error(e));
      return true;
    }
  }
  return false;
};

const parseNewAccessToken = (data: unknown): string => {
  assert(hasOwnProperty(data, 'access_token'), 'access_token not found in data response');
  assert(typeof data.access_token === 'string', 'access_token in data response is not a string');
  setTokenInFile('spotify_access_token', data.access_token);
  return data.access_token;
};

const parseNewTokens = (data: unknown): string => {
  assert(hasOwnProperty(data, 'access_token'), 'access_token not found in data response');
  assert(hasOwnProperty(data, 'refresh_token'), 'refresh_token not found in data response');
  assert(typeof data.access_token === 'string', 'access_token in data response is not a string');
  assert(typeof data.refresh_token === 'string', 'refresh_token in data response is not a string');
  setTokenInFile('spotify_access_token', data.access_token);
  setTokenInFile('spotify_refresh_token', data.refresh_token);
  return data.access_token;
};

const refreshAccessToken = async (spotifyConfig: SpotifyConfig): Promise<string> => {
  try {
    if (spotifyConfig === null) {
      throw new Error('Spotify configuration is missing.');
    }
    const refreshToken = getTokenFromFile('spotify_refresh_token');
    const url = `${SPOTIFY_AUTH_URL}token?client_id=${spotifyConfig.client_id}&client_secret=${
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
    checkResponseForErrors(data);
    return parseNewAccessToken(data);
  } catch (error) {
    throw new Error(`Unable to use Refresh Token to obtain new Access Token from Spotify. Error: ${errorMessage(error)}`);
  }
};

const getNewAccessToken = async (spotifyConfig: SpotifyConfig): Promise<string> => {
  try {
    if (spotifyConfig === null) {
      throw new Error('Spotify configuration is missing.');
    }
    const url = `${SPOTIFY_AUTH_URL}token?code=${spotifyConfig.auth_code}&grant_type=${spotifyConfig.grant_type}&redirect_uri=${spotifyConfig.redirect_uri}`;
    const result = await fetch(url, {
      method: 'post',
      headers: {
        Authorization: `Basic ${btoa(`${spotifyConfig.client_id}:${spotifyConfig.client_secret}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data: unknown = await result.json();
    checkResponseForErrors(data);
    return parseNewTokens(data);
  } catch (error) {
    throw new Error(`Unable to obtain new Access Token from Spotify. Error: ${errorMessage(error)}`);
  }
};

export const getSpotifyAccessToken = async (): Promise<string> => {
  const accessToken = getTokenFromFile('spotify_access_token');
  if (accessToken) {
    return accessToken;
  }
  try {
    const refreshToken = getTokenFromFile('spotify_refresh_token');
    if (refreshToken) {
      return await refreshAccessToken(Config.spotify);
    } else {
      return await getNewAccessToken(Config.spotify);
    }
  } catch (error) {
    throw new Error(`Unable to get Spotify Access Token. Error: ${errorMessage(error)}`);
  }
};
