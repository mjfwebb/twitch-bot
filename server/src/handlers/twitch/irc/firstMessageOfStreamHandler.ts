import type websocket from 'websocket';
import { findOrCreateUserById } from '../../../commands/helpers/findOrCreateUser';
import { sendChatMessage } from '../../../commands/helpers/sendChatMessage';
import Config from '../../../config';
import { Users } from '../../../storage-models/user-model';
import { getStreamStartedAt } from '../../../streamState';
import type { ParsedMessage } from '../../../types';

export function firstMessageOfStreamHandler(connection: websocket.connection, parsedMessage: ParsedMessage): void {
  // If the feature is disabled, then we don't handle this event
  if (!Config.features.first_message_of_stream_handler) {
    return;
  }

  const nick = parsedMessage.source?.nick;
  const userId = parsedMessage.tags?.['user-id'];
  const displayName = parsedMessage.tags?.['display-name'];

  if (userId && nick && displayName) {
    const user = findOrCreateUserById(userId, nick, displayName);

    if (new Date(user.lastSeen).getTime() < new Date(getStreamStartedAt()).getTime()) {
      user.lastSeen = new Date().toISOString();
      Users.saveOne(user);
      if (user.welcomeMessage) {
        if (user.welcomeMessage.startsWith('!') || user.welcomeMessage.startsWith('/')) {
          return;
        }
        sendChatMessage(connection, `${user.welcomeMessage.replace(/%nick%/gi, user.displayName || user.nick)}`);
      }
    }
  }
}
