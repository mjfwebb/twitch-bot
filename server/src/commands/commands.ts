import { botCommands } from '../botCommands';
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
      `Available commands are: ${botCommands
        .filter((bc) => bc.hidden !== true)
        .map((bc) => bc.id)
        .join(', ')}`,
    ),
  cooldown: 5000,
};
