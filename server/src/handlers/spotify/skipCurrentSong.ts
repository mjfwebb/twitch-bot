import { fetchWithRetry, getCurrentAccessToken } from "../../auth/spotify";
import Config from "../../config";
import { SPOTIFY_API_URL } from "../../constants";
import { logger } from "../../logger";

export const skipCurrentSong = async (): Promise<void> => {
  if (Config.spotify.enabled) {
    try {
      const url = `${SPOTIFY_API_URL}me/player/next`;

      await fetchWithRetry(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getCurrentAccessToken()}`,
        },
      });
    } catch (error) {
      logger.error(error);
    }
  }
};
