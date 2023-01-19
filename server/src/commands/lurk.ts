import { MINUTE_MS } from '../constants';
import type { BotCommand } from '../types';
import { sendChatMessage } from './helpers/sendChatMessage';

export const lurk: BotCommand = {
  command: 'lurk',
  id: 'lurk',
  description: "Say you'll be back soon",
  cooldown: 1 * MINUTE_MS,
  callback: (connection, parsedMessage) => {
    sendChatMessage(connection, `Thank you for the lurk ${parsedMessage.tags?.['display-name'] || '[unknown user]'}! Stay safe out there...`);
  },
};
