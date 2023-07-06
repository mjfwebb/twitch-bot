import { fetchWithRetry, getCurrentAccessToken } from '../../auth/spotify';
import Config from '../../config';
import { SPOTIFY_API_URL } from '../../constants';
import { hasOwnProperty } from '../../utils/hasOwnProperty';
import type { SpotifyTrack } from './types';

export const getTrack = async (trackId: string): Promise<SpotifyTrack | null> => {
  if (Config.spotify.enabled) {
    try {
      let url = `${SPOTIFY_API_URL}tracks/${trackId}`;
      if (Config.spotify.country_code) {
        url += `?market=${Config.spotify.country_code}`;
      }

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
