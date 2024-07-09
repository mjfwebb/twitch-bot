import { fetchWithRetry, getCurrentAccessToken } from '../../auth/spotify';
import Config from '../../config';
import { SPOTIFY_API_URL } from '../../constants';
import { logger } from '../../logger';

export const addSongToPlaybackQueue = async (trackURI: string): Promise<boolean> => {
  if (Config.spotify.enabled) {
    try {
      const url = `${SPOTIFY_API_URL}me/player/queue?uri=${encodeURIComponent(trackURI)}`;

      await fetchWithRetry({
        url,
        init: {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${getCurrentAccessToken()}`,
          },
        },
        shouldJSONParse: false,
      });
      return true;
    } catch (error) {
      logger.error(error);
    }
  }
  return false;
};
