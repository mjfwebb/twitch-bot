import { loadBotCommands } from '../botCommands';
import CommandModel from '../models/command-model';
import type { BotCommand } from '../types';
import { hasBotCommandParams } from './helpers/hasBotCommandParams';
import { sendChatMessage } from './helpers/sendChatMessage';

export const removecommand: BotCommand = {
  command: 'removecommand',
  id: 'removecommand',
  privileged: true,
  hidden: true,
  description: '',
  callback: async (connection, parsedCommand) => {
    if (hasBotCommandParams(parsedCommand.parsedMessage)) {
      const commandId = parsedCommand.parsedMessage.command?.botCommandParams;
      if (commandId) {
        const newCommandParts = commandId.split(' ');
        if (newCommandParts.length > 1) {
          return sendChatMessage(connection, 'Huh?');
        }
        const command = await CommandModel.findOne({ commandId });
        if (command) {
          await CommandModel.deleteOne({ commandId });
          await loadBotCommands();
          sendChatMessage(connection, `The command ${commandId} has been removed!`);
        }
      }
    }
  },
};
