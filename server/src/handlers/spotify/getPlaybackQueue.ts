import { fetchWithRetry, getCurrentAccessToken } from '../../auth/spotify';
import Config from '../../config';
import { SPOTIFY_API_URL } from '../../constants';
import { logger } from '../../logger';
import type { SpotifyQueue, SpotifySong } from './schemas';
import { spotifyQueueSchema } from './schemas';

const currentSong: SpotifySong | null = null;

export const getCurrentSpotifySong = () => currentSong;

export const getPlaybackQueue = async (): Promise<SpotifyQueue | null> => {
  if (Config.spotify.enabled) {
    try {
      const url = `${SPOTIFY_API_URL}me/player/queue`;

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

      const queueParse = spotifyQueueSchema.safeParse(result);
      if (queueParse.success) {
        return queueParse.data;
      } else {
        logger.error(`JSON response from Spotify API (getPlaybackQueue) is not valid: Error: ${queueParse.error}`);
      }
    } catch (error) {
      logger.error(error);
    }
  }

  return null;
};
