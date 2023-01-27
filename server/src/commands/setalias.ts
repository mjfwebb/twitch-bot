import type { BotCommand } from '../types';
import { hasBotCommandParams } from './helpers/hasBotCommandParams';
import { sendChatMessage } from './helpers/sendChatMessage';
import { loadBotCommands } from '../botCommands';
import CommandModel from '../models/command-model';

export const setalias: BotCommand = {
  command: 'setalias',
  id: 'setalias',
  priviliged: true,
  hidden: true,
  description: '',
  callback: async (connection, parsedMessage) => {
    if (hasBotCommandParams(parsedMessage)) {
      const newCommand = parsedMessage.command?.botCommandParams;
      if (newCommand) {
        const newCommandParts = newCommand.split(' ');
        if (newCommandParts.length > 1) {
          const commandName = newCommandParts[0];
          const commandAlias = newCommandParts[1];

          const command = await CommandModel.findOne({ commandId: commandName });
          if (command && command.command) {
            if (Array.isArray(command.command)) {
              command.command = [...command.command, commandAlias];
            } else {
              command.command = [command.command, commandAlias];
            }
            await command.save();
            await loadBotCommands();
            sendChatMessage(connection, `The alias for the command ${commandName} has been added!`);
          } else {
            sendChatMessage(connection, `Unable to find a command with the name ${commandName}.`);
          }
        }
      }
    }
  },
};
