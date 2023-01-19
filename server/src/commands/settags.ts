import { setStreamTags } from '../handlers/twitch/helix/setStreamTags';
import type { BotCommand } from '../types';
import { hasBotCommandParams } from './helpers/hasBotCommandParams';
import { sendChatMessage } from './helpers/sendChatMessage';

export const settags: BotCommand = {
  command: ['settags', 'tags'],
  id: 'settags',
  mustBeUser: 'athano',
  priviliged: true,
  hidden: true,
  callback: async (connection, parsedMessage) => {
    if (hasBotCommandParams(parsedMessage)) {
      const botCommandParams = parsedMessage.command?.botCommandParams;

      if (!botCommandParams) {
        return;
      }

      const newTags: string[] = botCommandParams.split(' ');

      if (!(newTags.length > 0)) {
        return sendChatMessage(connection, `modCheck tags?`);
      }

      if (newTags.length > 10) {
        return sendChatMessage(connection, `Too many tags! Maximum of 10 allowed.`);
      }

      if (!newTags.every((t) => t.length <= 25)) {
        return sendChatMessage(connection, `One or more tag is too long. Maximum length of a tag is 25`);
      }

      await setStreamTags(newTags);
      sendChatMessage(connection, `Tags updated to ${newTags.join(', ')} 🎉`);
    }
  },
};
