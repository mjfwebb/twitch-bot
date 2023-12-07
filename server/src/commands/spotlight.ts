import { SECOND_MS } from '../constants';
import { StreamState } from '../streamState';
import type { BotCommand } from '../types';
import { findOrCreateUserByName } from './helpers/findOrCreateUser';
import { hasBotCommandParams } from './helpers/hasBotCommandParams';
import { sendChatMessage } from './helpers/sendChatMessage';

export const spotlight: BotCommand = {
  command: 'spotlight',
  id: 'spotlight',
  cooldown: 1 * SECOND_MS,
  privileged: true,
  description: 'Set the spotlight on a user',
  callback: async (connection, parsedCommand) => {
    if (hasBotCommandParams(parsedCommand.parsedMessage)) {
      const targetName = parsedCommand.parsedMessage.command?.botCommandParams;
      if (targetName) {
        const user = await findOrCreateUserByName(targetName);
        if (user && user.userId && user.displayName) {
          if (StreamState.spotlightedUser === user.userId) {
            StreamState.spotlightedUser = undefined;
            sendChatMessage(connection, `${user.displayName} is no longer in the spotlight!`);
            return;
          } else {
            StreamState.spotlightedUser = user.userId;
            sendChatMessage(connection, `${user.displayName} is in the spotlight!`);
          }
        }
      }
    }
  },
};
