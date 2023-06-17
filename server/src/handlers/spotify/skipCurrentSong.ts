import Config from '../../config';
import { fetchWithRetry, getCurrentAccessToken } from '../../spotify';

export const skipCurrentSong = async (): Promise<void> => {
  if (Config.spotify) {
    try {
      const url = `https://api.spotify.com/v1/me/player/next`;

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
