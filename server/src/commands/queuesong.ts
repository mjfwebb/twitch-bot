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
      // Get the track input from the command params (the bit after the command)
      const trackInput = parsedCommand.parsedMessage.command.botCommandParams;

      // Define the start of a spotify url and uri
      const urlStart = 'https://open.spotify.com/track/';
      const trackStart = 'spotify:track:';

      // By default, assume the user has pasted a spotify uri, extract the track id
      let trackId = trackInput.slice(trackStart.length);

      // If the user has pasted a spotify url, extract the track id
      if (trackInput.startsWith(urlStart)) {
        trackId = trackInput.slice(urlStart.length);

        // If the url has a query string, remove it
        if (trackId.includes('?')) {
          trackId = trackId.split('?')[0];
        }
      }

      // If the input is neither a url or a uri, send a message to the chat and exit
      if (!trackInput.startsWith(trackStart) && !trackInput.startsWith(urlStart)) {
        sendChatMessage(connection, `That doesn't look right... athanoThink it needs to be like ${trackStart}stuff or ${urlStart}stuff`);
        return;
      }

      // Get the track from spotify
      const track = await getTrack(trackId);

      // Check if the song is playable in the streamer's country
      if (track && !track.is_playable) {
        sendChatMessage(connection, `Song "${track.name}" is not available for me athanoSad`);
        return;
      }

      // Add the track to the playback queue
      const songAddedToQueue = await addSongToPlaybackQueue(`${trackStart}${trackId}`);

      // If the track is not added to the queue, send a message to the chat and exit
      if (!songAddedToQueue) {
        sendChatMessage(connection, `Something went wrong adding the song to the queue athanoSad. Try again?`);
        return;
      }

      // If the track is not found, send a message to the chat and exit
      if (!track) {
        sendChatMessage(connection, `Song added to queue athanoCool`);
        return;
      }

      // // If the track is found, send a message to the chat and exit
      const trackArtists = track.artists.map((artist) => artist.name).join(', ');
      sendChatMessage(connection, `Song "${track.name} - ${trackArtists}" added to the queue athanoCool`);
    }
  },
};
