import { fetchChannelInformation } from '../handlers/twitch/helix/fetchChannelInformation';
import { setStreamTitle } from '../handlers/twitch/helix/setStreamTitle';
import type { BotCommand } from '../types';
import { hasBotCommandParams } from './helpers/hasBotCommandParams';
import { sendChatMessage } from './helpers/sendChatMessage';

export const settitle: BotCommand = {
  command: ['settitle', 'title'],
  id: 'settitle',
  mustBeUser: ['athano'],
  privileged: true,
  hidden: true,
  callback: async (connection, parsedCommand) => {
    if (hasBotCommandParams(parsedCommand.parsedMessage)) {
      const newTitle = parsedCommand.parsedMessage.command?.botCommandParams;
      if (newTitle) {
        await setStreamTitle(newTitle);
        sendChatMessage(connection, `Title updated to ${newTitle} 🎉`);
      }
    } else {
      const currentTitle = (await fetchChannelInformation())?.title;
      if (currentTitle) {
        sendChatMessage(connection, `Current title is: ${currentTitle}`);
      }
    }
  },
};
