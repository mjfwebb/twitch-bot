import { fetchWithRetry, getCurrentAccessToken } from '../../auth/spotify';
import Config from '../../config';
import { SPOTIFY_API_URL } from '../../constants';
import { logger } from '../../logger';
import { getIO } from '../../runSocketServer';
import { spotifySongSchema, type SpotifySong } from './schemas';

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
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getCurrentAccessToken()}`,
        },
      });

      // If the result is an error, return null
      if (!result) {
        logger.info('No result from Spotify, are you sure you have a song playing?');
        return null;
      }

      const song = spotifySongSchema.parse(result);
      getIO().emit('currentSong', song);
      if (song.item.id && getCurrentSpotifySong()?.item.id !== song.item.id) {
        playedSongs.push(song);
      }
    } catch (error) {
      logger.error(error);
    }
  }

  return null;
};
