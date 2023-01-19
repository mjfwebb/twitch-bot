import type { BotCommand } from '../types';
import { sendChatMessage } from './helpers/sendChatMessage';

export const bot: BotCommand = {
  command: ['bot', 'github'],
  id: 'bot',
  description: "The Twitch Bot's github page",
  callback: (connection) => sendChatMessage(connection, 'https://github.com/mjfwebb/twitch-bot'),
};
