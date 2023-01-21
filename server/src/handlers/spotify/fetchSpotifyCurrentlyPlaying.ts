import fetch from 'node-fetch';
import Config from '../../config';
import { getIO } from '../../runSocketServer';
import { fetchWithRetry, getCurrentAccessToken } from '../../spotify';
import { hasOwnProperty } from '../../utils/hasOwnProperty';

type SpotifySong = {
  timestamp: number;
  context: {
    external_urls: {
      spotify: string;
    };
    href: string;
    type: string;
    uri: string;
  };
  progress_ms: number;
  item: {
    album: {
      album_type: string;
      artists: [
        {
          external_urls: {
            spotify: string;
          };
          href: string;
          id: string;
          name: string;
          type: string;
          uri: string;
        },
      ];
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      images: {
        height: number;
        url: string;
        width: number;
      }[];
      name: string;
      release_date: string;
      release_date_precision: string;
      total_tracks: number;
      type: string;
      uri: string;
    };
    artists: {
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      name: string;
      type: string;
      uri: string;
    }[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: {
      isrc: string;
    };
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    is_local: boolean;
    is_playable: boolean;
    name: string;
    popularity: number;
    preview_url: string;
    track_number: number;
    type: string;
    uri: string;
  };
  currently_playing_type: string;
  actions: {
    disallows: {
      resuming: boolean;
    };
  };
  is_playing: boolean;
};

let currentSong: SpotifySong | null = null;

export const getCurrentSpotifySong = () => currentSong;

export const fetchSpotifyCurrentlyPlaying = async (): Promise<SpotifySong | null> => {
  if (Config.spotify) {
    try {
      const url = `https://api.spotify.com/v1/me/player/currently-playing`;

      const result = await fetchWithRetry(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getCurrentAccessToken()}`,
        },
      });
      if (
        hasOwnProperty(result, 'item') &&
        hasOwnProperty(result.item, 'name') &&
        hasOwnProperty(result.item, 'external_urls') &&
        hasOwnProperty(result.item.external_urls, 'spotify') &&
        typeof result.item.name === 'string' &&
        typeof result.item.external_urls.spotify === 'string'
      ) {
        getIO().emit('currentSong', result);
        currentSong = result as SpotifySong;
      }
    } catch (error) {
      console.error(error);
    }
  }
  return null;
};
