import type websocket from 'websocket';
import { sendChatMessage } from '../../../commands/helpers/sendChatMessage';
import Config from '../../../config';
import type { ParsedMessage } from '../../../types';

export function firstMessageHandler(connection: websocket.connection, parsedMessage: ParsedMessage): void {
  // If the feature is disabled, then we don't handle this event
  if (!Config.features.first_message_handler) {
    return;
  }

  const firstMessage = parsedMessage.tags?.['first-msg'];
  const nick = parsedMessage.source?.nick;

  if (nick && firstMessage && firstMessage === '1') {
    sendChatMessage(connection, `Welcome to the show, ${nick}!`);
  }
}
