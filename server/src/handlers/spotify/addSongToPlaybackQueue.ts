import { fetchWithRetry, getCurrentAccessToken } from '../../auth/spotify';
import Config from '../../config';
import { SPOTIFY_API_URL } from '../../constants';

export const addSongToPlaybackQueue = async (trackURI: string): Promise<boolean> => {
  if (Config.spotify.enabled) {
    try {
      const url = `${SPOTIFY_API_URL}me/player/queue?uri=${encodeURIComponent(trackURI)}`;

      await fetchWithRetry(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getCurrentAccessToken()}`,
        },
      });
      return true;
    } catch (error) {
      console.error(error);
    }
  }
  return false;
};
