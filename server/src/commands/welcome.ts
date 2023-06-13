import type { BotCommand } from '../types';
import { findOrCreateUserById } from './helpers/findOrCreateUser';
import { hasBotCommandParams } from './helpers/hasBotCommandParams';
import { sendChatMessage } from './helpers/sendChatMessage';

export const welcome: BotCommand = {
  command: 'welcome',
  id: 'welcome',
  description: 'Change your welcome message. Use %nick% to put your name in it!',
  callback: async (connection, parsedCommand) => {
    if (hasBotCommandParams(parsedCommand.parsedMessage)) {
      const userId = parsedCommand.parsedMessage.tags?.['user-id'];
      const nick = parsedCommand.parsedMessage.source?.nick;
      const welcomeMessage = parsedCommand.parsedMessage.command?.botCommandParams;
      if (userId && nick && welcomeMessage && !welcomeMessage.startsWith('!') && !welcomeMessage.startsWith('/')) {
        const user = await findOrCreateUserById(userId, nick);
        user.welcomeMessage = welcomeMessage;
        await user.save();
        sendChatMessage(connection, `Welcome message updated 🎉`);
      } else {
        sendChatMessage(connection, `There was a problem updating your welcome message 😭`);
      }
    }
  },
};
