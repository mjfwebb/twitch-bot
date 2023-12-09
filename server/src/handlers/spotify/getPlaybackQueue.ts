import { fetchWithRetry, getCurrentAccessToken } from '../../auth/spotify';
import Config from '../../config';
import { SPOTIFY_API_URL } from '../../constants';
import { logger } from '../../logger';
import type { SpotifySong, SpotifyTracks } from './schemas';
import { spotifyTracksSchema } from './schemas';

const currentSong: SpotifySong | null = null;

export const getCurrentSpotifySong = () => currentSong;

export const getPlaybackQueue = async (): Promise<SpotifyTracks | null> => {
  if (Config.spotify.enabled) {
    try {
      const url = `${SPOTIFY_API_URL}me/player/queue`;

      const result = await fetchWithRetry(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getCurrentAccessToken()}`,
        },
      });
      return spotifyTracksSchema.parse(result);
    } catch (error) {
      logger.error(error);
    }
  }

  return null;
};
