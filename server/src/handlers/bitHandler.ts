import type websocket from 'websocket';
import { sendChatMessage } from '../commands/helpers/sendChatMessage';
import { playSound } from '../playSound';
import type { ParsedMessage } from '../types';

export function bitHandler(connection: websocket.connection, parsedMessage: ParsedMessage) {
  const bits = parsedMessage.tags?.bits;

  if (bits && bits !== '0') {
    // NOTE: In theory we could send a websocket event to the client here, so we can do some kind of visual display
    // Oh shit, bits!
    playSound('success');
    sendChatMessage(connection, 'oh shit! bits! ♥');
  }
}
