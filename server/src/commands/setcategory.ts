import Config from '../config';
import { fetchGameByName } from '../handlers/twitch/helix/fetchGameByName';
import { setStreamGame } from '../handlers/twitch/helix/setStreamGame';
import type { BotCommand } from '../types';
import { hasBotCommandParams } from './helpers/hasBotCommandParams';
import { sendChatMessage } from './helpers/sendChatMessage';

export const setcategory: BotCommand = {
  command: ['setcategory', 'category'],
  id: 'setcategory',
  mustBeUser: [Config.twitch.account],
  privileged: true,
  hidden: true,
  callback: async (connection, parsedCommand) => {
    if (hasBotCommandParams(parsedCommand.parsedMessage)) {
      const newCategory = parsedCommand.parsedMessage.command?.botCommandParams;
      if (newCategory) {
        const game = await fetchGameByName(newCategory);
        if (game) {
          await setStreamGame(game.id);
          sendChatMessage(connection, `Category updated to ${newCategory} 🎉`);
        }
      }
    }
  },
};
