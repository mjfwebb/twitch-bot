import { fetchGameByName } from '../handlers/twitch/helix/fetchGameByName';
import { setStreamGame } from '../handlers/twitch/helix/setStreamGame';
import { hasBotCommandParams } from './helpers/hasBotCommandParams';
import { sendChatMessage } from './helpers/sendChatMessage';
import type { BotCommand } from '../types';

export const setcategory: BotCommand = {
  command: ['setcategory', 'category'],
  id: 'setcategory',
  mustBeUser: ['athano'],
  priviliged: true,
  hidden: true,
  callback: async (connection, parsedCommand) => {
    if (hasBotCommandParams(parsedCommand.parsedMessage)) {
      const newCategory = parsedCommand.parsedMessage.command?.botCommandParams;
      if (newCategory) {
        const newCategoryId = await fetchGameByName(newCategory);
        if (newCategoryId) {
          await setStreamGame(newCategoryId);
          sendChatMessage(connection, `Category updated to ${newCategory} 🎉`);
        }
      }
    }
  },
};
