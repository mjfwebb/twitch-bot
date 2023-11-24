import { loadBotCommands } from '../botCommands';
import { Commands } from '../storage-models/command-model';
import type { BotCommand } from '../types';
import { hasBotCommandParams } from './helpers/hasBotCommandParams';
import { sendChatMessage } from './helpers/sendChatMessage';
import { stripLeadingExclamationMark } from './helpers/stripLeadingExclamationMark';

export const setalias: BotCommand = {
  command: 'setalias',
  id: 'setalias',
  privileged: true,
  hidden: true,
  description: '',
  callback: (connection, parsedCommand) => {
    if (hasBotCommandParams(parsedCommand.parsedMessage)) {
      const newCommand = parsedCommand.parsedMessage.command?.botCommandParams;
      if (newCommand) {
        const newCommandParts = newCommand.split(' ');
        if (newCommandParts.length > 1) {
          const commandName = stripLeadingExclamationMark(newCommandParts[0]);
          const commandAlias = stripLeadingExclamationMark(newCommandParts[1]);

          const command = Commands.findOneByCommandId(commandName);
          if (command && command.command) {
            if (Array.isArray(command.command)) {
              command.command = [...command.command, commandAlias];
            } else {
              command.command = [command.command, commandAlias];
            }
            command.updatedAt = new Date().toISOString();
            Commands.saveOne(command);
            loadBotCommands();
            sendChatMessage(connection, `The alias for the command ${commandName} has been added!`);
          } else {
            sendChatMessage(connection, `Unable to find a command with the name ${commandName}.`);
          }
        }
      }
    }
  },
};
