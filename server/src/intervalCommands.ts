import { getConnection } from './bot';
import { sendChatMessage } from './helpers/sendChatMessage';
import { getSteamState } from './streamState';

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
      tickInterval: 300,
      currentTick: 0,
      tickOffset: 10,
    },
  ];

  setInterval(() => {
    const connection = getConnection();
    if (!connection) {
      return;
    }

    const streamState = getSteamState();
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
  }, 1000);
}
