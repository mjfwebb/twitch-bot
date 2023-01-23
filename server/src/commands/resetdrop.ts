import { MINUTE_MS } from '../constants';
import type { BotCommand } from '../types';
import { sendChatMessage } from './helpers/sendChatMessage';

export const resetdrop: BotCommand = {
  command: 'resetdrop',
  description: 'Reset the dropgame drop area',
  id: 'resetdrop',
  callback: (connection) => {
    sendChatMessage(connection, '!resetdrop');
  },
  cooldown: 5 * MINUTE_MS,
};
