import { getBotCommands } from '../botCommands';
import type { BotCommand } from '../types';
import { sendChatMessage } from './helpers/sendChatMessage';

export const commands: BotCommand = {
  command: 'commands',
  id: 'commands',
  description: "It's the commands command to see the commands",
  hidden: true,
  callback: (connection) =>
    sendChatMessage(
      connection,
      `Available commands are: ${getBotCommands()
        .filter((bc) => {
          if (bc.mustBeUser) {
            return false;
          }
          if (bc.hidden) {
            return false;
          }
          if (bc.priviliged) {
            return false;
          }
          return true;
        })
        .sort((a, b) => {
          if (a.id < b.id) {
            return -1;
          } else if (a.id > b.id) {
            return 1;
          }
          return 0;
        })
        .map((bc) => bc.id)
        .join(', ')}`,
    ),
  cooldown: 5000,
};
