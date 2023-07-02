import { getChatExlusionList } from '../../../chatExclusionList';
import { addChatMessage } from '../../../chatMessages';
import { getChatUser } from '../../../commands/helpers/findOrCreateUser';
import type { ParsedMessage } from '../../../types';

export async function messageHandler(parsedMessage: ParsedMessage): Promise<void> {
  const userId = parsedMessage.tags?.['user-id'];
  const nick = parsedMessage.source?.nick;
  const displayName = parsedMessage.tags?.['display-name'];
  const chatMessageId = parsedMessage.tags?.['id'];

  const chatExcludedUsers = getChatExlusionList();

  if (userId && nick && displayName && chatMessageId) {
    const chatUser = await getChatUser(userId, nick, displayName);

    // If the user is in the chat exclusion list, don't add the message
    if (chatExcludedUsers.has(chatUser.displayName.toLowerCase())) {
      return;
    }

    if (chatUser) {
      addChatMessage({ id: chatMessageId, user: chatUser, parsedMessage });
    }
  }
}
