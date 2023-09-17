import { loadBotCommands } from '../botCommands';
import { Commands } from '../storage-models/command-model';
import type { BotCommand } from '../types';
import { hasBotCommandParams } from './helpers/hasBotCommandParams';
import { sendChatMessage } from './helpers/sendChatMessage';

export const removealias: BotCommand = {
  command: 'removealias',
  id: 'removealias',
  privileged: true,
  hidden: true,
  description: 'Remove the alias for a command. Usage: !removealias <command> <alias>',
  callback: (connection, parsedCommand) => {
    if (hasBotCommandParams(parsedCommand.parsedMessage)) {
      const newCommand = parsedCommand.parsedMessage.command?.botCommandParams;
      if (newCommand) {
        const newCommandParts = newCommand.split(' ');
        if (newCommandParts.length > 1) {
          const commandName = newCommandParts[0];
          const commandAlias = newCommandParts[1];

          const command = Commands.findOneByCommandId(commandName);

          // Make sure the command exists
          if (!command) {
            sendChatMessage(connection, `Unable to find a command with the name ${commandName}.`);
            return;
          }

          // Make sure commandName and commandAlias are not the same
          if (commandName === commandAlias) {
            sendChatMessage(connection, `The alias to be removed cannot be the same as the command name.`);
            return;
          }

          if (!Array.isArray(command.command)) {
            sendChatMessage(connection, `The command ${commandName} does not have any aliases.`);
            return;
          }

          if (Array.isArray(command.command)) {
            // Is alias in the array?
            const aliasIndex = command.command.findIndex((c) => c === commandAlias);
            if (aliasIndex > -1) {
              command.command.splice(aliasIndex, 1);
              command.updatedAt = new Date().toISOString();
              Commands.saveOne(command);
              loadBotCommands();
              sendChatMessage(connection, `The alias ${commandAlias} for the command ${commandName} has been removed!`);
            } else {
              sendChatMessage(connection, `The command ${commandName} does not have the alias ${commandAlias}.`);
            }
          }
        }
      }
    }
  },
};
