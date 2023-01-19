import { MINUTE_MS } from '../constants';
import type { BotCommand } from '../types';
import { sendChatMessage } from './helpers/sendChatMessage';

export const delvoid: BotCommand = {
  command: ['delvoid', 'delv'],
  id: 'delvoid',
  cooldown: 0.5 * MINUTE_MS,
  callback: (connection) => {
    sendChatMessage(connection, 'Delvoid: I hate eslint', 3);
  },
  description: 'This command explains how much Delvoid loves eslint',
};
