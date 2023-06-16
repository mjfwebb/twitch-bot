import type { User } from './models/user-model';
import { getIO } from './runSocketServer';
import type { ParsedMessage } from './types';

type ChatMessage = { user: User; parsedMessage: ParsedMessage };

const CHAT_MESSAGES_TO_RETAIN = 20;
const chatMessages: ChatMessage[] = [];

export const getChatMessages = (): void => {
  getIO().emit('chatMessages', chatMessages.slice(0, CHAT_MESSAGES_TO_RETAIN));
};

export const addChatMessage = (chatMessage: { user: User; parsedMessage: ParsedMessage }) => {
  chatMessages.splice(CHAT_MESSAGES_TO_RETAIN);
  chatMessages.push(chatMessage);
  getIO().emit('chatMessage', chatMessage);
};
