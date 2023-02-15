import type { BotCommand } from '../types';
import { hasBotCommandParams } from './helpers/hasBotCommandParams';
import { sendChatMessage } from './helpers/sendChatMessage';
import { findOrCreateCommand } from './helpers/findOrCreateCommand';
import { loadBotCommands } from '../botCommands';

export const addcommand: BotCommand = {
  command: 'addcommand',
  id: 'addcommand',
  priviliged: true,
  hidden: true,
  description: '',
  callback: async (connection, parsedCommand) => {
    if (hasBotCommandParams(parsedCommand.parsedMessage)) {
      const newCommand = parsedCommand.parsedMessage.command?.botCommandParams;
      if (newCommand) {
        const newCommandParts = newCommand.split(' ');
        if (newCommandParts.length > 1) {
          const newCommandName = newCommandParts[0];
          const command = await findOrCreateCommand(newCommandName);
          const newCommandMessage = newCommandParts.splice(1).join(' ');
          command.command = newCommandName;
          command.message = newCommandMessage;
          await command.save();
          await loadBotCommands();
          sendChatMessage(connection, `The command ${newCommandName} has been added!`);
        }
      }
    }
  },
};
