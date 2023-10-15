import { fetchWithRetry, getCurrentAccessToken } from "../../auth/spotify";
import Config from "../../config";
import { SPOTIFY_API_URL } from "../../constants";
import { logger } from "../../logger";
import { hasOwnProperty } from "../../utils/hasOwnProperty";
import type { SpotifySong, SpotifyTrack } from "./types";

const currentSong: SpotifySong | null = null;

export const getCurrentSpotifySong = () => currentSong;

export const getPlaybackQueue = async (): Promise<SpotifyTrack[] | null> => {
  if (Config.spotify.enabled) {
    try {
      const url = `${SPOTIFY_API_URL}me/player/queue`;

      const result = await fetchWithRetry(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCurrentAccessToken()}`,
        },
      });
      if (
        hasOwnProperty(result, "currently_playing") &&
        hasOwnProperty(result, "queue")
      ) {
        return result.queue as SpotifyTrack[];
      }
    } catch (error) {
      logger.error(error);
    }
  }

  return null;
};
