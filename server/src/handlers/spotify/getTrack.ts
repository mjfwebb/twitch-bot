import Config from '../../config';
import { fetchWithRetry, getCurrentAccessToken } from '../../spotify';
import { hasOwnProperty } from '../../utils/hasOwnProperty';
import type { SpotifyTrack } from './types';

export const getTrack = async (trackId: string): Promise<SpotifyTrack | null> => {
  if (Config.spotify) {
    try {
      const url = `https://api.spotify.com/v1/tracks/${trackId}`;

      const result = await fetchWithRetry(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getCurrentAccessToken()}`,
        },
      });
      if (hasOwnProperty(result, 'album') && hasOwnProperty(result, 'name') && typeof result.name === 'string') {
        return result as SpotifyTrack;
      }
    } catch (error) {
      console.error(error);
    }
  }
  return null;
};
