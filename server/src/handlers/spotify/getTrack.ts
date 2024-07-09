import { fetchWithRetry, getCurrentAccessToken } from '../../auth/spotify';
import Config from '../../config';
import { SPOTIFY_API_URL } from '../../constants';
import { logger } from '../../logger';
import { spotifyTrackSchema, type SpotifyTrack } from './schemas';

export const getTrack = async (trackId: string): Promise<SpotifyTrack | null> => {
  if (Config.spotify.enabled) {
    try {
      let url = `${SPOTIFY_API_URL}tracks/${trackId}`;
      if (Config.spotify.country_code) {
        url += `?market=${Config.spotify.country_code}`;
      }

      const result = await fetchWithRetry({
        url,
        init: {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getCurrentAccessToken()}`,
          },
        },
      });
      return spotifyTrackSchema.parse(result);
    } catch (error) {
      logger.error(error);
    }
  }

  return null;
};
