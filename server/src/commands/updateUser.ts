import type { BotCommand } from '../types';
import { hasBotCommandParams } from './helpers/hasBotCommandParams';
import { sendChatMessage } from './helpers/sendChatMessage';
import { updateUserByName } from './helpers/updateUser';

export const updateUser: BotCommand = {
  command: 'updateUser',
  id: 'updateUser',
  hidden: true,
  privileged: true,
  cooldown: 0,
  callback: async (connection, parsedCommand) => {
    if (hasBotCommandParams(parsedCommand.parsedMessage)) {
      const targetName = parsedCommand.parsedMessage.command?.botCommandParams;
      if (targetName) {
        const user = await updateUserByName(targetName);
        if (user && user.userId && user.displayName) {
          sendChatMessage(connection, `User information updated for ${user.displayName}`);
        } else {
          sendChatMessage(connection, 'Huh?');
        }
      }
    }
  },
  description: '',
};
