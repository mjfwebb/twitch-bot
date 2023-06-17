import { SECOND_MS } from '../constants';
import { skipCurrentSong } from '../handlers/spotify/skipCurrentSong';
import type { BotCommand } from '../types';
import { sendChatMessage } from './helpers/sendChatMessage';

export const skipsong: BotCommand = {
  command: 'skipsong',
  id: 'skipsong',
  cooldown: 1 * SECOND_MS,
  privileged: true,
  description: 'Skips the currently playing song (on Spotify)',
  callback: async (connection) => {
    await skipCurrentSong();
    sendChatMessage(connection, 'Skipping!');
  },
};
