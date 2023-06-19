import Config from '../../config';
import { SPOTIFY_API_URL } from '../../constants';
import { fetchWithRetry, getCurrentAccessToken } from '../../spotify';

export const skipCurrentSong = async (): Promise<void> => {
  if (Config.spotify.enabled) {
    try {
      const url = `${SPOTIFY_API_URL}me/player/next`;

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
