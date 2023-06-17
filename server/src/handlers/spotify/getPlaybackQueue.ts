import Config from '../../config';
import { SPOTIFY_API_URL } from '../../constants';
import { fetchWithRetry, getCurrentAccessToken } from '../../spotify';
import { hasOwnProperty } from '../../utils/hasOwnProperty';
import type { SpotifySong, SpotifyTrack } from './types';

const currentSong: SpotifySong | null = null;

export const getCurrentSpotifySong = () => currentSong;

export const getPlaybackQueue = async (): Promise<SpotifyTrack[] | null> => {
  if (Config.spotify) {
    try {
      const url = `${SPOTIFY_API_URL}me/player/queue`;

      const result = await fetchWithRetry(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getCurrentAccessToken()}`,
        },
      });
      console.log({ result });
      if (hasOwnProperty(result, 'currently_playing') && hasOwnProperty(result, 'queue')) {
        return result.queue as SpotifyTrack[];
      }
    } catch (error) {
      console.error(error);
    }
  }
  return null;
};
