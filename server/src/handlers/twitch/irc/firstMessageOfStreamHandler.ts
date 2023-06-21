import type websocket from 'websocket';
import { findOrCreateUserById } from '../../../commands/helpers/findOrCreateUser';
import { sendChatMessage } from '../../../commands/helpers/sendChatMessage';
import Config from '../../../config';
import { getStreamStartedAt } from '../../../streamState';
import type { ParsedMessage } from '../../../types';

export async function firstMessageOfStreamHandler(connection: websocket.connection, parsedMessage: ParsedMessage): Promise<void> {
  // If mongoDB is not enabled, then we don't handle this event as it relies on the database to store the welcome message
  if (!Config.mongoDB.enabled) {
    return;
  }

  const nick = parsedMessage.source?.nick;
  const userId = parsedMessage.tags?.['user-id'];

  if (userId && nick) {
    const user = await findOrCreateUserById(userId, nick);

    if (new Date(user.lastSeen).getTime() < new Date(getStreamStartedAt()).getTime()) {
      user.lastSeen = new Date().toISOString();
      await user.save();
      if (user.welcomeMessage) {
        if (user.welcomeMessage.startsWith('!') || user.welcomeMessage.startsWith('/')) {
          return;
        }
        sendChatMessage(connection, `${user.welcomeMessage.replace(/%nick%/gi, user.displayName || user.nick)}`);
      }
    }
  }
}
