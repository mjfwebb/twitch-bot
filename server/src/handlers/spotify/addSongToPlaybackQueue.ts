import Config from '../../config';
import { SPOTIFY_API_URL } from '../../constants';
import { fetchWithRetry, getCurrentAccessToken } from '../../spotify';

export const addSongToPlaybackQueue = async (trackURI: string): Promise<void> => {
  if (Config.spotify) {
    try {
      const url = `${SPOTIFY_API_URL}me/player/queue?uri=${encodeURIComponent(trackURI)}`;

      await fetchWithRetry(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getCurrentAccessToken()}`,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
};
