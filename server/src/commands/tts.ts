import { ttsStreamElementsHandler } from '../handlers/streamelements/ttsStreamElementsHandler';
import type { BotCommand } from '../types';

export const tts: BotCommand = {
  command: 'tts',
  id: 'tts',
  description: 'Make your message audible! Used like !tts hello stream!',
  callback: async (_, parsedCommand) => {
    const params = parsedCommand.parsedMessage.command?.botCommandParams;
    if (params) {
      await ttsStreamElementsHandler('Brian', params);
    }
  },
};
