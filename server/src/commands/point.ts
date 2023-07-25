import { Users } from '../storage-models/user-model';
import type { BotCommand } from '../types';
import { findUserByTargetName } from './helpers/findOrCreateUser';
import { hasBotCommandParams } from './helpers/hasBotCommandParams';
import { sendChatMessage } from './helpers/sendChatMessage';

export const point: BotCommand = {
  command: 'point',
  id: 'point',
  cooldown: 0,
  mustBeUser: ['athano'],
  description: 'Add a point to a user for being helpful',
  callback: (connection, parsedCommand) => {
    if (hasBotCommandParams(parsedCommand.parsedMessage)) {
      const targetName = parsedCommand.parsedMessage.command?.botCommandParams;
      if (targetName) {
        const user = findUserByTargetName(targetName);
        if (user && user.userId && user.displayName) {
          user.points += 1;
          Users.saveOne(user);
          sendChatMessage(connection, `A point has been awarded to ${user.displayName}. They now have ${user.points} points.`);
        } else {
          sendChatMessage(connection, 'Huh?');
        }
      }
    }
  },
};
