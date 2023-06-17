import type websocket from 'websocket';
import { getChatUser } from '../../../commands/helpers/findOrCreateUser';
import { sendChatMessage } from '../../../commands/helpers/sendChatMessage';
import { getStreamStartedAt } from '../../../streamState';
import type { ParsedMessage } from '../../../types';

export async function firstMessageOfStreamHandler(connection: websocket.connection, parsedMessage: ParsedMessage) {
  const nick = parsedMessage.source?.nick;
  const userId = parsedMessage.tags?.['user-id'];

  if (userId && nick) {
    const user = await getChatUser(userId, nick);

    if (new Date(user.lastSeen).getTime() < new Date(getStreamStartedAt()).getTime()) {
      if (user.welcomeMessage) {
        if (user.welcomeMessage.startsWith('!') || user.welcomeMessage.startsWith('/')) {
          return;
        }
        sendChatMessage(connection, `${user.welcomeMessage.replace(/%nick%/gi, user.displayName || user.nick)}`);
      }
    }
  }
}
