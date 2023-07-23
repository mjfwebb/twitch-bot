import { SECOND_MS } from '../constants';
import { getLastSpotifySong } from '../handlers/spotify/fetchCurrentlyPlaying';
import type { BotCommand } from '../types';
import { sendChatMessage } from './helpers/sendChatMessage';
import { songDetails } from './helpers/songDetail';

export const lastsong: BotCommand = {
  command: ['lastsong', 'ls'],
  id: 'lastsong',
  cooldown: 1 * SECOND_MS,
  description: 'Gets the previously played song (on Spotify)',
  callback: (connection) => {
    const lastSong = getLastSpotifySong();
    const last = lastSong ? `Last song was ${songDetails(lastSong.item)}` : 'No Spotify connection found';
    sendChatMessage(connection, last);
  },
};
