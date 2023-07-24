import { Users } from '../storage-models/user-model';
import type { BotCommand } from '../types';
import { findOrCreateUserByName } from './helpers/findOrCreateUser';
import { hasBotCommandParams } from './helpers/hasBotCommandParams';
import { sendChatMessage } from './helpers/sendChatMessage';

export const point: BotCommand = {
  command: 'point',
  id: 'point',
  cooldown: 0,
  mustBeUser: ['athano'],
  description: 'Add a point to a user for being helpful',
  callback: async (connection, parsedCommand) => {
    if (hasBotCommandParams(parsedCommand.parsedMessage)) {
      const targetName = parsedCommand.parsedMessage.command?.botCommandParams;
      if (targetName) {
        const user = await findOrCreateUserByName(targetName);
        if (user && user.userId && user.displayName) {
          user.points += 1;
          Users.saveOne(user);
          sendChatMessage(connection, `Point added to ${user.displayName}`);
        } else {
          sendChatMessage(connection, 'Huh?');
        }
      }
    }
  },
};
