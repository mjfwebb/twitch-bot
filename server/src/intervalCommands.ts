import type { connection } from 'websocket';
import { sendChatMessage } from './commands/helpers/sendChatMessage';
import { SECOND_MS } from './constants';
import { fetchCurrentlyPlaying } from './handlers/spotify/fetchCurrentlyPlaying';
import { getConnection } from './ircWebsocket';
import { getStreamStatus } from './streamState';

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
      tickInterval: 60 * 20,
      currentTick: 0,
      tickOffset: 30,
    },
    {
      callback: (connection) =>
        sendChatMessage(connection, 'This twitch bot is opensource and the source code can be found at https://github.com/mjfwebb/twitch-bot/'),
      tickInterval: 60 * 30,
      currentTick: 0,
      tickOffset: 120,
    },
    {
      callback: async () => {
        await fetchCurrentlyPlaying();
      },
      tickInterval: 5,
      currentTick: 0,
      tickOffset: 0,
    },
  ];

  async function runInterval() {
    const connection = getConnection();
    if (!connection) {
      return;
    }

    const streamState = getStreamStatus();
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
