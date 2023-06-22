import { getIO } from './runSocketServer';
import type { ChatMessage } from './types';

const CHAT_MESSAGES_TO_RETAIN = 20;
const chatMessages: ChatMessage[] = [];

export const getChatMessages = (): void => {
  getIO().emit('chatMessages', chatMessages.slice(0, CHAT_MESSAGES_TO_RETAIN));
};

export const addChatMessage = (chatMessage: ChatMessage) => {
  chatMessages.splice(CHAT_MESSAGES_TO_RETAIN);
  chatMessages.push(chatMessage);
  getIO().emit('chatMessage', chatMessage);
};
