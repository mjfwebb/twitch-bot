import { describe, expect, test } from 'vitest';

import { CHAT_MESSAGES_TO_RETAIN } from '../constants';
import { makeIO } from '../runSocketServer';
import { addChatMessage, chatMessages } from './chatMessages';
import { generateFakeChatMessage } from './getFakeChatMessages';

describe('chatMessages', () => {
  test('getChatMessages', () => {
    makeIO(1234);
    for (let i = 0; i < 40; i++) {
      const fakeMessage = generateFakeChatMessage(i);
      addChatMessage(fakeMessage);
    }
    console.log(chatMessages.length);
    expect(chatMessages.length).toBe(CHAT_MESSAGES_TO_RETAIN);
    expect(chatMessages[0].id).toBe('fake-chat-message-id-20');
    expect(chatMessages[CHAT_MESSAGES_TO_RETAIN - 1].id).toBe('fake-chat-message-id-39');
    addChatMessage(generateFakeChatMessage(40));
    expect(chatMessages.length).toBe(CHAT_MESSAGES_TO_RETAIN);
    expect(chatMessages[0].id).toBe('fake-chat-message-id-21');
  });
});
