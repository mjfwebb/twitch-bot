import type { BotCommand } from '../types';
import { sendChatMessage } from './helpers/sendChatMessage';

export const w: BotCommand = {
  command: 'w',
  id: 'w',
  description: "It's a win",
  callback: (connection, parsedCommand) => sendChatMessage(connection, `Big W ${parsedCommand.parsedMessage.command?.botCommandParams || ''}`),
};
