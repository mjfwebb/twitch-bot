import Config from '../../config';
import { fetchWithRetry, getCurrentAccessToken } from '../../spotify';

export const addSongToPlaybackQueue = async (trackURI: string): Promise<void> => {
  if (Config.spotify) {
    try {
      const url = `https://api.spotify.com/v1/me/player/queue?uri=${encodeURIComponent(trackURI)}`;

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
