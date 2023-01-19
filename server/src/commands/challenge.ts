import type { BotCommand } from '../types';
import { sendChatMessage } from './helpers/sendChatMessage';

export const challenge: BotCommand = {
  command: 'challenge',
  id: 'challenge',
  description: 'Want to help with complex Typescript? Try this out.',
  callback: (connection) => {
    sendChatMessage(connection, 'For the current challenge, check out https://github.com/mjfwebb/twitch-bot/issues/16');
  },
};
