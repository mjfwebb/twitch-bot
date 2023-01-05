import { getConnection } from './bot';
import { sendChatMessage } from './helpers/sendChatMessage';

interface IntervalCommand {
  message: string;
  tickInterval: number;
  currentTick: number;
  tickOffset: number;
}

export function runIntervalCommands() {
  const intervalCommands: IntervalCommand[] = [
    {
      message: 'Hey have you heard about the word? The bird is the word!',
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
