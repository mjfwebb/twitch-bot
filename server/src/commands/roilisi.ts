import type { BotCommand } from '../types';
import { sendChatMessage } from './helpers/sendChatMessage';

export const roilisi: BotCommand = {
  command: 'roilisi',
  id: 'roilisi',
  description: 'Shows how resilient roilisi is',
  callback: (connection) => {
    sendChatMessage(connection, "You can try to break me, but you won't succeed UwU");
  },
};
