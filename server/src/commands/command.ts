import type { BotCommand } from '../types';
import { findOrCreateCommand } from './helpers/findOrCreateCommand';
import { generateCommandMessage } from './helpers/generateCommandMessage';
import { sendChatMessage } from './helpers/sendChatMessage';

export const command: BotCommand = {
  command: ['command', 'help'],
  id: 'command',
  description: 'Use this command to find out more about a command',
  callback: async (connection, parsedCommand) => {
    const commandData = await findOrCreateCommand(parsedCommand.botCommand.id);
    const message = generateCommandMessage(parsedCommand.commandName, parsedCommand.botCommand, commandData);

    sendChatMessage(connection, message);
  },
  cooldown: 5000,
};
