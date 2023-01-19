import type { BotCommand } from '../types';
import { sendChatMessage } from './helpers/sendChatMessage';

export const flappieh: BotCommand = {
  command: 'flappieh',
  id: 'flappieh',
  description: 'In honour of those who were missed',
  callback: (connection) => {
    sendChatMessage(connection, 'My actual hero ♥');
  },
};
