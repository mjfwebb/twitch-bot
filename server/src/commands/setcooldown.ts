import { loadBotCommands } from '../botCommands';
import CommandModel from '../models/command-model';
import type { BotCommand } from '../types';
import { hasBotCommandParams } from './helpers/hasBotCommandParams';
import { sendChatMessage } from './helpers/sendChatMessage';

export const setcooldown: BotCommand = {
  command: 'setcooldown',
  id: 'setcooldown',
  privileged: true,
  hidden: true,
  description: "Set the command's cooldown to the provided milliseconds",
  callback: async (connection, parsedCommand) => {
    if (hasBotCommandParams(parsedCommand.parsedMessage)) {
      const newCommand = parsedCommand.parsedMessage.command?.botCommandParams;
      if (newCommand) {
        const newCommandParts = newCommand.split(' ');
        if (newCommandParts.length > 1) {
          const commandName = newCommandParts[0];
          const newCommandCooldown = parseInt(newCommandParts[1]);
          const command = await CommandModel.findOne({ commandId: commandName });
          if (command) {
            if (newCommandCooldown <= 0) {
              sendChatMessage(connection, `Invalid cooldown parameter provided.`);
            }
            command.cooldown = newCommandCooldown;
            await command.save();
            await loadBotCommands();
            sendChatMessage(connection, `The cooldown for the command ${commandName} has been updated!`);
          } else {
            sendChatMessage(connection, `Unable to find a command with the name ${commandName}.`);
          }
        }
      }
    }
  },
};
