import { getChatExlusionList } from '../../../chatExclusionList';
import { addChatMessage } from '../../../chatMessages';
import { getChatUser } from '../../../commands/helpers/findOrCreateUser';
import type { ParsedMessage } from '../../../types';

export async function messageHandler(parsedMessage: ParsedMessage): Promise<void> {
  const userId = parsedMessage.tags?.['user-id'];
  const chatMessageId = parsedMessage.tags?.['id'];

  const chatExcludedUsers = getChatExlusionList();

  if (userId && chatMessageId) {
    const chatUser = await getChatUser(parsedMessage);

    // If the user is in the chat exclusion list, don't add the message
    if (chatExcludedUsers.has(chatUser.displayName.toLowerCase())) {
      return;
    }

    if (chatUser) {
      addChatMessage({ id: chatMessageId, user: chatUser, parsedMessage });
    }
  }
}
