import type { User } from './models/user-model';
import { getIO } from './runSocketServer';
import type { ChatMessage, ParsedMessage } from './types';

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
