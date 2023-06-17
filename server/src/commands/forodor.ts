import { MINUTE_MS } from '../constants';
import type { BotCommand } from '../types';
import { isError } from '../utils/isError';
import { sendChatMessage } from './helpers/sendChatMessage';

export const forodor: BotCommand = {
  command: 'forodor',
  id: 'forodor',
  mustBeUser: ['forodor'],
  cooldown: 5 * MINUTE_MS,
  description: 'This is basically graffiti',
  callback: (connection) => {
    sendChatMessage(connection, 'null is just a number');
    try {
      throw new Error('Forodor was here');
    } catch (error) {
      if (isError(error)) {
        sendChatMessage(connection, error.message);
      }
    }
  },
};
