import { CHAT_MESSAGES_TO_RETAIN } from '../constants';
import { getIO } from '../runSocketServer';
import type { ChatMessage } from '../types';

export const chatMessages: ChatMessage[] = [];

export const getChatMessages = (): void => {
  getIO().emit('chatMessages', chatMessages.slice(0, CHAT_MESSAGES_TO_RETAIN));
};

export const addChatMessage = (chatMessage: ChatMessage) => {
  chatMessages.push(chatMessage);
  // Remove CHAT_MESSAGES_TO_RETAIN messages from the array
  chatMessages.splice(0, chatMessages.length - CHAT_MESSAGES_TO_RETAIN);

  getIO().emit('chatMessage', chatMessage);
};
