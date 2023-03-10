import type websocket from 'websocket';
import StreamModel from '../../../models/stream-model';
import { sendChatMessage } from '../../../commands/helpers/sendChatMessage';
import type { ParsedMessage } from '../../../types';
import { findOrCreateUserById } from '../../../commands/helpers/findOrCreateUser';

export async function firstMessageOfStreamHandler(connection: websocket.connection, parsedMessage: ParsedMessage) {
  const nick = parsedMessage.source?.nick;
  const userId = parsedMessage.tags?.['user-id'];

  if (userId && nick) {
    const stream = await StreamModel.findOne({});
    if (stream) {
      const user = await findOrCreateUserById(userId);

      if (new Date(user.lastSeen).getTime() < new Date(stream.startedAt).getTime()) {
        if (user.welcomeMessage) {
          user.lastSeen = new Date().toISOString();
          await user.save();
          if (user.welcomeMessage.startsWith('!') && user.welcomeMessage.startsWith('/')) {
            return;
          }
          sendChatMessage(connection, `${user.welcomeMessage.replace(/%nick%/gi, nick)}`);
        }
      }
    }
  }
}
