import type { BotCommand } from '../types';
import { sendChatMessage } from './helpers/sendChatMessage';

export const bluepin: BotCommand = {
  command: 'bluepin',
  id: 'bluepin',
  description: 'Blatant advertising',
  callback: (connection) => sendChatMessage(connection, 'Wishlist Explory Story on Steam! https://store.steampowered.com/app/1626280/Explory_Story/'),
};
