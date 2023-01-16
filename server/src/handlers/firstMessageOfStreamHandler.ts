import type websocket from 'websocket';
import StreamModel from '../models/stream-model';
import { sendChatMessage } from '../helpers/sendChatMessage';
import type { ParsedMessage } from '../types';
import { findOrCreateUser } from '../helpers/findOrCreateUser';

export async function firstMessageOfStreamHandler(connection: websocket.connection, parsedMessage: ParsedMessage) {
  const nick = parsedMessage.source?.nick;
  const userId = parsedMessage.tags?.['user-id'];

  if (userId && nick) {
    const stream = await StreamModel.findOne({});
    if (stream) {
      const user = await findOrCreateUser(userId);

      if (new Date(user.lastSeen).getTime() < new Date(stream.startedAt).getTime()) {
        user.lastSeen = new Date().toISOString();
        await user.save();
        sendChatMessage(connection, `${user.welcomeMessage} ${nick}!`);
      }
    }
  }
}
