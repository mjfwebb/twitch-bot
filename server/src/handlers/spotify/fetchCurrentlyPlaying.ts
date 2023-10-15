import { fetchWithRetry, getCurrentAccessToken } from "../../auth/spotify";
import Config from "../../config";
import { SPOTIFY_API_URL } from "../../constants";
import { logger } from "../../logger";
import { getIO } from "../../runSocketServer";
import { hasOwnProperty } from "../../utils/hasOwnProperty";
import type { SpotifySong } from "./types";

const playedSongs: SpotifySong[] = [];

export const getCurrentSpotifySong = (): SpotifySong | null => {
  if (playedSongs.length === 0) {
    return null;
  }
  return playedSongs[playedSongs.length - 1];
};

export const getLastSpotifySong = (): SpotifySong | null => {
  if (playedSongs.length < 2) {
    return null;
  }
  return playedSongs[playedSongs.length - 2];
};

export const fetchCurrentlyPlaying = async (): Promise<SpotifySong | null> => {
  if (Config.spotify.enabled) {
    try {
      const url = `${SPOTIFY_API_URL}me/player/currently-playing`;

      const result = await fetchWithRetry(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCurrentAccessToken()}`,
        },
      });

      // If the result is an error, return null
      if (!result) {
        logger.info(
          "No result from Spotify, are you sure you have a song playing?",
        );
        return null;
      }

      if (
        hasOwnProperty(result, "item") &&
        hasOwnProperty(result.item, "name") &&
        hasOwnProperty(result.item, "external_urls") &&
        hasOwnProperty(result.item.external_urls, "spotify") &&
        typeof result.item.name === "string" &&
        typeof result.item.external_urls.spotify === "string"
      ) {
        getIO().emit("currentSong", result);
        const resultSong = result as SpotifySong;
        if (
          resultSong.item.id &&
          getCurrentSpotifySong()?.item.id !== resultSong.item.id
        ) {
          playedSongs.push(result as SpotifySong);
        }
      }
    } catch (error) {
      logger.error(error);
    }
  }

  return null;
};
