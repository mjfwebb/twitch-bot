import { getConnection } from './bot';
import { SECOND_MS } from './constants';
import { sendChatMessage } from './commands/helpers/sendChatMessage';
import { getStreamState } from './streamState';
import type { connection } from 'websocket';
import { fetchSpotifyCurrentlyPlaying } from './handlers/spotify/fetchSpotifyCurrentlyPlaying';

interface IntervalCommand {
  callback: ((connection: connection) => void) | ((connection: connection) => Promise<void>);
  tickInterval: number;
  currentTick: number;
  tickOffset: number;
}

export function runIntervalCommands() {
  const intervalCommands: IntervalCommand[] = [
    {
      callback: (connection) =>
        sendChatMessage(
          connection,
          "Have you tried out Between Worlds? It's free to play in your browser right now, no sign up required! https://betweenworlds.net",
        ),
      tickInterval: 60 * 15,
      currentTick: 0,
      tickOffset: 30,
    },
    {
      callback: async () => {
        await fetchSpotifyCurrentlyPlaying();
      },
      tickInterval: 1,
      currentTick: 0,
      tickOffset: 0,
    },
  ];

  async function runInterval() {
    const connection = getConnection();
    if (!connection) {
      return;
    }

    const streamState = getStreamState();
    if (streamState === 'offline') {
      return;
    }

    for (const intervalCommand of intervalCommands) {
      if (intervalCommand.currentTick === intervalCommand.tickInterval + intervalCommand.tickOffset) {
        await intervalCommand.callback(connection);
        intervalCommand.currentTick = 0;
        intervalCommand.tickOffset = 0;
      } else {
        intervalCommand.currentTick += 1;
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  setInterval(runInterval, SECOND_MS);
}
