import type websocket from 'websocket';
import { sendChatMessage } from '../commands/helpers/sendChatMessage';
import type { ParsedMessage } from '../types';

export function returningChatterHandler(connection: websocket.connection, parsedMessage: ParsedMessage) {
  const returningChatter = parsedMessage.tags?.['returning-chatter'];
  const nick = parsedMessage.source?.nick;

  if (nick && returningChatter && returningChatter === '1') {
    sendChatMessage(connection, `Welcome back, ${nick}!`);
  }
}
