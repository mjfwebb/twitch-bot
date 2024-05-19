import type { BotCommand } from '../types';
import { findUserByTargetName } from './helpers/findOrCreateUser';
import { hasBotCommandParams } from './helpers/hasBotCommandParams';
import { sendChatMessage } from './helpers/sendChatMessage';

export const points: BotCommand = {
  command: 'points',
  id: 'points',
  cooldown: 0,
  description: 'Show how many points you or someone has',
  callback: (connection, parsedCommand) => {
    if (hasBotCommandParams(parsedCommand.parsedMessage)) {
      const targetName = parsedCommand.parsedMessage.command?.botCommandParams;
      if (targetName) {
        const user = findUserByTargetName(targetName);
        if (user && user.userId && user.displayName) {
          sendChatMessage(connection, `${user.displayName} has ${user.points} points`);
        }
      }
    } else {
      const userId = parsedCommand.parsedMessage.tags?.['user-id'];
      const userName = parsedCommand.parsedMessage.tags?.['display-name'];
      if (userId && userName) {
        const user = findUserByTargetName(userName);
        if (user) {
          sendChatMessage(connection, `${user.displayName} has ${user.points} points`);
        } else {
          sendChatMessage(connection, `Sorry, I can't find anything about ${userName}`);
        }
      }
    }
  },
};
