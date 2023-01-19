import type { BotCommand } from '../types';
import { sendChatMessage } from './helpers/sendChatMessage';

export const haliphax: BotCommand = {
  command: 'haliphax',
  description: "It's basically advertising",
  id: 'haliphax',
  callback: (connection) => {
    sendChatMessage(connection, 'Go play https://yokai.quest/');
  },
};
