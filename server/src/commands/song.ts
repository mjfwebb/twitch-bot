import { SECOND_MS } from '../constants';
import { getCurrentSpotifySong } from '../handlers/spotify/fetchCurrentlyPlaying';
import type { BotCommand } from '../types';
import { sendChatMessage } from './helpers/sendChatMessage';
import { songDetails } from './helpers/songDetail';

export const song: BotCommand = {
  command: 'song',
  id: 'song',
  cooldown: 1 * SECOND_MS,
  description: 'Gets the currently playing song (on Spotify)',
  callback: (connection) => {
    const currentlyPlayingSong = getCurrentSpotifySong();
    const currentlyPlaying = currentlyPlayingSong ? `Current song is ${songDetails(currentlyPlayingSong.item)}` : 'No Spotify connection found';
    sendChatMessage(connection, currentlyPlaying);
  },
};
