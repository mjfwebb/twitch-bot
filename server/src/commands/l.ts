import type { BotCommand } from '../types';
import { sendChatMessage } from './helpers/sendChatMessage';

export const l: BotCommand = {
  command: 'l',
  id: 'l',
  description: "It's a loss",
  callback: (connection, parsedCommand) => sendChatMessage(connection, `Fat L ${parsedCommand.parsedMessage.command?.botCommandParams || ''}`),
};
