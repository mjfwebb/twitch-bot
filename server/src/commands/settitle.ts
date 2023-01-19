import { hasBotCommandParams } from './helpers/hasBotCommandParams';
import type { BotCommand } from '../types';
import { setStreamTitle } from '../handlers/twitch/helix/setStreamTitle';
import { sendChatMessage } from './helpers/sendChatMessage';
import { fetchChannelInformation } from '../handlers/twitch/helix/fetchChannelInformation';

export const settitle: BotCommand = {
  command: ['settitle', 'title'],
  id: 'settitle',
  mustBeUser: 'athano',
  priviliged: true,
  hidden: true,
  callback: async (connection, parsedMessage) => {
    if (hasBotCommandParams(parsedMessage)) {
      const newTitle = parsedMessage.command?.botCommandParams;
      if (newTitle) {
        await setStreamTitle(newTitle);
        sendChatMessage(connection, `Title updated to ${newTitle} 🎉`);
      }
    } else {
      const currentTitle = (await fetchChannelInformation())?.title;
      if (currentTitle) {
        sendChatMessage(connection, `Current title is ${currentTitle}`);
      }
    }
  },
};
