import type websocket from 'websocket';
import { sendChatMessage } from '../../../commands/helpers/sendChatMessage';
import Config from '../../../config';
import { playSound } from '../../../playSound';
import type { ParsedMessage } from '../../../types';

export async function bitHandler(connection: websocket.connection, parsedMessage: ParsedMessage): Promise<void> {
  // If the feature is disabled, then we don't handle this event
  if (!Config.features.bit_handler) {
    return;
  }

  const bits = parsedMessage.tags?.bits;

  if (bits && bits !== '0') {
    // NOTE: In theory we could send a websocket event to the client here, so we can do some kind of visual display
    // Oh shit, bits!
    await playSound('success');
    sendChatMessage(connection, 'oh shit! bits! ♥');
  }
}
