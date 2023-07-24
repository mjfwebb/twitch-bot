import { getIO } from '../runSocketServer';
import type { ChatMessage, ParsedMessage } from '../types';

let fakeChatMessageCount = 0;

const words: string[] = [
  'sunshine',
  'tiger',
  'ballerina',
  'whisker',
  'melody',
  'captain',
  'serendipity',
  'moonlight',
  'treasure',
  'bubblegum',
  'laughter',
  'adventurer',
  'stardust',
  'carousel',
  'daydream',
  'wanderlust',
  'magic',
  'potion',
  'whispering',
  'meadow',
  'storyteller',
  'radiant',
  'mermaid',
  'lullaby',
  'enchanted',
  'forest',
  'harmony',
  'giggleberry',
  'treasure',
  'chest',
];

function randomString() {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';

  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

function getFakeChatMessage(): string {
  const numWords = Math.floor(Math.random() * 10) + 1;
  const fakeMessage: string = words
    .sort(() => 0.5 - Math.random())
    .slice(0, numWords)
    .join(' ');
  return fakeMessage;
}

export const generateFakeChatMessage = (index = 0) => {
  const username = randomString();
  const message = getFakeChatMessage();
  const sentTime = new Date().toISOString();
  const user: ChatMessage['user'] = {
    userId: 'fake-user-id',
    nick: 'fake-nick',
    displayName: username,
    points: 0,
    experience: 0,
    lastSeen: sentTime,
    avatarUrl: `https://picsum.photos/100/100?random=${index + 1}`,
    welcomeMessage: '',
    createdAt: sentTime,
    updatedAt: sentTime,
    numberOfMessages: 0,
  };

  const parsedMessage: ParsedMessage = {
    tags: {
      'display-name': username,
      'user-id': 'fake-user-id',
      'tmi-sent-ts': sentTime,
    },
    source: null,
    command: {
      command: 'PRIVMSG',
      botCommandParams: message,
    },
    parameters: message,
  };

  const fakeChatMessage: ChatMessage = {
    id: `fake-chat-message-id-${fakeChatMessageCount++}`,
    user,
    parsedMessage,
  };

  return fakeChatMessage;
};

export const getFakeChatMessages = (amount: number) => {
  for (let index = 0; index < amount; index++) {
    const fakeChatMessage = generateFakeChatMessage(index);

    getIO().emit('chatMessage', fakeChatMessage);
  }
};
