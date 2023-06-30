import { addChatMessage } from '../../../chatMessages';
import { getChatUser } from '../../../commands/helpers/findOrCreateUser';
import type { ParsedMessage } from '../../../types';

export async function messageHandler(parsedMessage: ParsedMessage): Promise<void> {
  const userId = parsedMessage.tags?.['user-id'];
  const chatMessageId = parsedMessage.tags?.['id'];

  if (userId && chatMessageId) {
    const chatUser = await getChatUser(parsedMessage);
    if (chatUser) {
      addChatMessage({ id: chatMessageId, user: chatUser, parsedMessage });
    }
  }
}
