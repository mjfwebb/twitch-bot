import { loadBotCommands } from '../botCommands';
import { Commands } from '../storage-models/command-model';
import type { BotCommand } from '../types';
import { hasBotCommandParams } from './helpers/hasBotCommandParams';
import { sendChatMessage } from './helpers/sendChatMessage';
import { stripLeadingExclamationMark } from './helpers/stripLeadingExclamationMark';

export const setcooldown: BotCommand = {
  command: 'setcooldown',
  id: 'setcooldown',
  privileged: true,
  hidden: true,
  description: "Set the command's cooldown to the provided milliseconds",
  callback: (connection, parsedCommand) => {
    if (hasBotCommandParams(parsedCommand.parsedMessage)) {
      const newCommand = parsedCommand.parsedMessage.command?.botCommandParams;
      if (newCommand) {
        const newCommandParts = newCommand.split(' ');
        if (newCommandParts.length > 1) {
          const commandName = stripLeadingExclamationMark(newCommandParts[0]);
          const newCommandCooldown = Number(newCommandParts[1]);
          if (isNaN(newCommandCooldown) || newCommandCooldown <= 0) {
            sendChatMessage(connection, `Invalid cooldown parameter provided.`);
            return;
          }
          const command = Commands.findOneByCommandId(commandName);
          if (command) {
            command.cooldown = newCommandCooldown;
            command.updatedAt = new Date().toISOString();
            Commands.saveOne(command);
            loadBotCommands();
            sendChatMessage(connection, `The cooldown for the command ${commandName} has been updated!`);
          } else {
            sendChatMessage(connection, `Unable to find a command with the name ${commandName}.`);
          }
        }
      }
    }
  },
};
