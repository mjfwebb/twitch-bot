import type { BotCommand } from '../types';
import { sendChatMessage } from './helpers/sendChatMessage';

export const athanotime: BotCommand = {
  command: ['athanotime', 'time'],
  id: 'athanotime',
  description: 'Tells you what it is where Athano is',
  callback: (connection) => {
    const now = new Date();
    sendChatMessage(connection, now.toTimeString());
  },
};
