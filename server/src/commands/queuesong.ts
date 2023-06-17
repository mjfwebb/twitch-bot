import { SECOND_MS } from '../constants';
import { addSongToPlaybackQueue } from '../handlers/spotify/addSongToPlaybackQueue';
import { getTrack } from '../handlers/spotify/getTrack';
import type { BotCommand } from '../types';
import { hasBotCommandParams } from './helpers/hasBotCommandParams';
import { sendChatMessage } from './helpers/sendChatMessage';

export const queuesong: BotCommand = {
  command: ['queuesong', 'qs'],
  id: 'queuesong',
  cooldown: 1 * SECOND_MS,
  privileged: true,
  description: 'Add a song to the playback queue (on Spotify)',
  callback: async (connection, parsedCommand) => {
    if (hasBotCommandParams(parsedCommand.parsedMessage)) {
      const trackInput = parsedCommand.parsedMessage.command.botCommandParams;
      const trackStart = 'spotify:track:';
      if (!trackInput.startsWith(trackStart)) {
        sendChatMessage(connection, `That doesn't look right... athanoThink it needs to be like spotify:track:stuff`);
      } else {
        const trackId = trackInput.slice(trackStart.length);
        const track = await getTrack(trackId);
        await addSongToPlaybackQueue(trackInput);
        if (!track) {
          sendChatMessage(connection, `Song added to queue athanoCool`);
        } else {
          const trackArtists = track.artists.map((artist) => artist.name).join(', ');
          sendChatMessage(connection, `Song ${track.name} - ${trackArtists} added to queue athanoCool`);
        }
      }
    }
  },
};
