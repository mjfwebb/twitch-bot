import { SECOND_MS } from '../constants';
import { fetchSpotifyCurrentlyPlaying } from '../handlers/fetchSpotifyCurrentlyPlaying';
import type { BotCommand } from '../types';
import { sendChatMessage } from './helpers/sendChatMessage';

export const song: BotCommand = {
  command: 'song',
  id: 'song',
  cooldown: 30 * SECOND_MS,
  description: 'Gets the currently playing song (on Spotify)',
  callback: async (connection) => {
    const currentlyPlaying = await fetchSpotifyCurrentlyPlaying();
    sendChatMessage(connection, currentlyPlaying);
  },
};
