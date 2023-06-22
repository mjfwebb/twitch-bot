import Config from '../../config';
import { SPOTIFY_API_URL } from '../../constants';
import { getIO } from '../../runSocketServer';
import { fetchWithRetry, getCurrentAccessToken } from '../../spotify';
import { hasOwnProperty } from '../../utils/hasOwnProperty';
import type { SpotifySong } from './types';

let currentSong: SpotifySong | null = null;

export const getCurrentSpotifySong = () => currentSong;

export const fetchCurrentlyPlaying = async (): Promise<SpotifySong | null> => {
  if (Config.spotify.enabled) {
    try {
      const url = `${SPOTIFY_API_URL}me/player/currently-playing`;

      const result = await fetchWithRetry(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getCurrentAccessToken()}`,
        },
      });

      // If the result is an error, return null
      if (!result) {
        console.log('No result from Spotify, are you sure you have a song playing?');
        return null;
      }

      if (
        hasOwnProperty(result, 'item') &&
        hasOwnProperty(result.item, 'name') &&
        hasOwnProperty(result.item, 'external_urls') &&
        hasOwnProperty(result.item.external_urls, 'spotify') &&
        typeof result.item.name === 'string' &&
        typeof result.item.external_urls.spotify === 'string'
      ) {
        getIO().emit('currentSong', result);
        currentSong = result as SpotifySong;
      }
    } catch (error) {
      console.error(error);
    }
  }

  return null;
};
