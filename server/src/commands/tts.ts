import { writeFileSync } from 'fs';
import { VOICES } from '../constants';
import { ttsStreamElementsHandler } from '../handlers/streamelements/ttsStreamElementsHandler';
import { ttsTikTokHandler } from '../handlers/tiktok/ttsTikTokHandler';
import { playSound } from '../playSound';
import type { BotCommand } from '../types';

type Voice = {
  name: string;
  id: string;
  api: string;
};

async function getVoiceBuffer(voice: Voice, text: string): Promise<Buffer | null> {
  switch (voice.api) {
    case 'streamelements': {
      const buffer = await ttsStreamElementsHandler(voice.id, text);
      return buffer;
    }
    case 'tiktok': {
      const buffer = await ttsTikTokHandler(voice.id, text);
      return buffer;
    }
    default:
      return null;
  }
}

export const runTTS = async (message: string) => {
  const words = message.split(' ');
  let nextVoice: Voice = {
    name: 'Brian',
    id: 'Brian',
    api: 'streamelements',
  };
  let currentMessage = '';
  let buffer: Buffer = Buffer.from([]);

  for (const word of words) {
    let skip = false;
    if (word.endsWith(':')) {
      const voice = word.slice(0, -1);
      const voiceLowerCase = voice.toLowerCase();
      for (const voice of VOICES) {
        if (voice.name.toLowerCase() === voiceLowerCase) {
          if (currentMessage.length > 0) {
            const result = await getVoiceBuffer(nextVoice, currentMessage);
            if (result) {
              buffer = Buffer.concat([buffer, result]);
            }
          }
          skip = true;
          nextVoice = voice;
          currentMessage = '';
          break;
        }
      }
    }
    if (!skip) {
      currentMessage += `${word} `;
    }
  }

  if (currentMessage.length > 0) {
    const result = await getVoiceBuffer(nextVoice, currentMessage);
    if (result) {
      buffer = Buffer.concat([buffer, result]);
    }
  }

  const id = Math.random().toString(36).substring(2, 15);
  writeFileSync(`../tts/${id}.mp3`, buffer);

  await playSound(`../tts/${id}.mp3`);
};

export const tts: BotCommand = {
  command: 'tts',
  id: 'tts',
  description: 'Make your message audible! Used like !tts hello stream!',
  callback: async (_, parsedCommand) => {
    const params = parsedCommand.parsedMessage.command?.botCommandParams;
    if (params) {
      await runTTS(params);
    }
  },
};
