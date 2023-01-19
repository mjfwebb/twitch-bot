import type { BotCommand } from '../types';
import { sendChatMessage } from './helpers/sendChatMessage';

export const w: BotCommand = {
  command: 'w',
  id: 'w',
  description: "It's a win",
  callback: (connection, parsedMessage) => sendChatMessage(connection, `Big W ${parsedMessage.command?.botCommandParams || ''}`),
};
