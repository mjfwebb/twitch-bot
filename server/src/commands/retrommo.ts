import type { BotCommand } from '../types';
import { sendChatMessage } from './helpers/sendChatMessage';

export const retrommo: BotCommand = {
  command: ['retrommo', 'evanmmo'],
  id: 'retrommo',
  description: 'Blatant advertising',
  callback: (connection) => {
    sendChatMessage(connection, 'Go play https://retro-mmo.com/');
  },
};
