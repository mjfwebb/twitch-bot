import { reloadBotCommands } from '../botCommands';
import { Commands } from '../storage-models/command-model';
import type { BotCommand } from '../types';
import { hasBotCommandParams } from './helpers/hasBotCommandParams';
import { sendChatMessage } from './helpers/sendChatMessage';

export const setdescription: BotCommand = {
  command: 'setdescription',
  id: 'setdescription',
  privileged: true,
  hidden: true,
  description: '',
  callback: (connection, parsedCommand) => {
    if (hasBotCommandParams(parsedCommand.parsedMessage)) {
      const newCommand = parsedCommand.parsedMessage.command?.botCommandParams;
      if (newCommand) {
        const newCommandParts = newCommand.split(' ');
        if (newCommandParts.length > 1) {
          const commandName = newCommandParts[0];
          const command = Commands.findOneByCommandAlias(commandName);
          if (command) {
            const newCommandDescrition = newCommandParts.splice(1).join(' ');
            command.description = newCommandDescrition;
            command.updatedAt = new Date().toISOString();
            Commands.saveOne(command);
            reloadBotCommands();
            sendChatMessage(connection, `The description for the command ${commandName} has been updated!`);
          } else {
            sendChatMessage(connection, `Unable to find a command with the name ${commandName}.`);
          }
        }
      }
    }
  },
};
