import { SECOND_MS } from '../constants';
import { getCurrentSpotifySong } from '../handlers/spotify/fetchCurrentlyPlaying';
import { skipCurrentSong } from '../handlers/spotify/skipCurrentSong';
import type { BotCommand } from '../types';
import { sendChatMessage } from './helpers/sendChatMessage';
import { songDetails } from './helpers/songDetail';

export const skipsong: BotCommand = {
  command: ['skipsong', 'ss'],
  id: 'skipsong',
  cooldown: 1 * SECOND_MS,
  privileged: true,
  description: 'Skips the currently playing song (on Spotify)',
  callback: async (connection) => {
    const currentlyPlayingSong = getCurrentSpotifySong();
    await skipCurrentSong();
    sendChatMessage(connection, `Skipping ${currentlyPlayingSong ? songDetails(currentlyPlayingSong.item, false) : 'song'}`);
  },
};
