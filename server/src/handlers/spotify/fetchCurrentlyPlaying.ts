import Config from '../../config';
import { getIO } from '../../runSocketServer';
import { fetchWithRetry, getCurrentAccessToken } from '../../spotify';
import { hasOwnProperty } from '../../utils/hasOwnProperty';
import type { SpotifySong } from './types';

let currentSong: SpotifySong | null = null;

export const getCurrentSpotifySong = () => currentSong;

export const fetchCurrentlyPlaying = async (): Promise<SpotifySong | null> => {
  if (Config.spotify) {
    try {
      const url = `https://api.spotify.com/v1/me/player/currently-playing`;

      const result = await fetchWithRetry(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getCurrentAccessToken()}`,
        },
      });
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
