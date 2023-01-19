import type { BotCommand } from '../types';
import { sendChatMessage } from './helpers/sendChatMessage';

export const jumpy: BotCommand = {
  command: 'jumpy',
  id: 'jumpy',
  description: 'Added by jumpylionn',
  callback: (connection) => {
    sendChatMessage(connection, 'jumpylionnn is the best!!!');
  },
};
