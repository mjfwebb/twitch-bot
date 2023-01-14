import fetch from 'node-fetch';
import Config from '../config';
import { hasOwnProperty } from '../utils/hasOwnProperty';

export const fetchSpotifyCurrentlyPlaying = async (): Promise<string> => {
  if (Config.spotify) {
    try {
      const url = `https://api.spotify.com/v1/me/player/currently-playing`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Config.spotify.oauth_token}`,
        },
      });
      const result: unknown = await response.json();
      if (
        hasOwnProperty(result, 'item') &&
        hasOwnProperty(result.item, 'name') &&
        hasOwnProperty(result.item, 'external_urls') &&
        hasOwnProperty(result.item.external_urls, 'spotify') &&
        typeof result.item.name === 'string' &&
        typeof result.item.external_urls.spotify === 'string'
      ) {
        return `Current song is ${result.item.name} (link: ${result.item.external_urls.spotify})`;
      }
    } catch (error) {
      console.error(error);
    }
  }
  return 'No Spotify connection found';
};
