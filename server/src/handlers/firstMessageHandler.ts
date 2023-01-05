import type websocket from 'websocket';
import { sendChatMessage } from '../helpers/sendChatMessage';
import type { ParsedMessage } from '../types';

export function firstMessageHandler(connection: websocket.connection, parsedMessage: ParsedMessage) {
  const firstMessage = parsedMessage.tags?.['first-msg'];
  const nick = parsedMessage.source?.nick;

  if (nick && firstMessage && firstMessage === '1') {
    sendChatMessage(connection, `Welcome to the show, ${nick}!`);
  }
}
