import { getConnection } from './bot';
import { SECOND_MS } from './constants';
import { sendChatMessage } from './commands/helpers/sendChatMessage';
import { getStreamState } from './streamState';

interface IntervalCommand {
  message: string;
  tickInterval: number;
  currentTick: number;
  tickOffset: number;
}

export function runIntervalCommands() {
  const intervalCommands: IntervalCommand[] = [
    {
      message: "Have you tried out Between Worlds? It's free to play in your browser right now, no sign up required! https://betweenworlds.net",
      tickInterval: 60 * 15,
      currentTick: 0,
      tickOffset: 30,
    },
  ];

  setInterval(() => {
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
        sendChatMessage(connection, intervalCommand.message);
        intervalCommand.currentTick = 0;
        intervalCommand.tickOffset = 0;
      } else {
        intervalCommand.currentTick += 1;
      }
    }
  }, SECOND_MS);
}
