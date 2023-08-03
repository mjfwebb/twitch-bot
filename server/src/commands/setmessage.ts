import { loadBotCommands } from '../botCommands';
import { Commands } from '../storage-models/command-model';
import type { BotCommand } from '../types';
import { hasBotCommandParams } from './helpers/hasBotCommandParams';
import { sendChatMessage } from './helpers/sendChatMessage';

export const setmessage: BotCommand = {
  command: 'setmessage',
  id: 'setmessage',
  privileged: true,
  hidden: true,
  description: "Set the command's message to the provided message",
  callback: (connection, parsedCommand) => {
    if (hasBotCommandParams(parsedCommand.parsedMessage)) {
      const newCommand = parsedCommand.parsedMessage.command?.botCommandParams;
      if (newCommand) {
        const newCommandParts = newCommand.split(' ');
        if (newCommandParts.length > 1) {
          const commandName = newCommandParts[0];
          const newCommandMessage = newCommandParts.slice(1).join(' ');
          const command = Commands.findOneByCommandId(commandName);
          if (command) {
            command.message = newCommandMessage;
            command.updatedAt = new Date().toISOString();
            Commands.saveOne(command);
            loadBotCommands();
            sendChatMessage(connection, `The message for the command ${commandName} has been updated!`);
          } else {
            sendChatMessage(connection, `Unable to find a command with the name ${commandName}.`);
          }
        }
      }
    }
  },
};
