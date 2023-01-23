import type { BotCommand } from '../types';
import { findOrCreateUserById } from './helpers/findOrCreateUser';
import { hasBotCommandParams } from './helpers/hasBotCommandParams';
import { sendChatMessage } from './helpers/sendChatMessage';

export const welcome: BotCommand = {
  command: 'welcome',
  id: 'welcome',
  description: 'Change your welcome message. Use %nick% to put your name in it!',
  callback: async (connection, parsedMessage) => {
    if (hasBotCommandParams(parsedMessage)) {
      const userId = parsedMessage.tags?.['user-id'];
      const welcomeMessage = parsedMessage.command?.botCommandParams;
      if (userId && welcomeMessage && !welcomeMessage.startsWith('!') && !welcomeMessage.startsWith('/')) {
        const user = await findOrCreateUserById(userId);
        user.welcomeMessage = welcomeMessage;
        await user.save();
        sendChatMessage(connection, `Welcome message updated 🎉`);
      } else {
        sendChatMessage(connection, `There was a problem updating your welcome message 😭`);
      }
    }
  },
};
