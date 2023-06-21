import type websocket from 'websocket';
import { sendChatMessage } from '../../../commands/helpers/sendChatMessage';
import Config from '../../../config';
import type { ParsedMessage } from '../../../types';

export function returningChatterHandler(connection: websocket.connection, parsedMessage: ParsedMessage): void {
  // If the feature is disabled, then we don't handle this event
  if (!Config.features.returning_chatter_handler) {
    return;
  }

  const returningChatter = parsedMessage.tags?.['returning-chatter'];
  const nick = parsedMessage.source?.nick;

  if (nick && returningChatter && returningChatter === '1') {
    sendChatMessage(connection, `Welcome back, ${nick}!`);
  }
}
