import { loadBotCommands } from '../botCommands';
import type { Command } from '../storage-models/command-model';
import { Commands } from '../storage-models/command-model';
import type { BotCommand } from '../types';
import { hasBotCommandParams } from './helpers/hasBotCommandParams';
import { sendChatMessage } from './helpers/sendChatMessage';

export const addcommand: BotCommand = {
  command: 'addcommand',
  id: 'addcommand',
  privileged: true,
  hidden: true,
  description: 'Adds a new command to the bot',
  callback: (connection, parsedCommand) => {
    if (hasBotCommandParams(parsedCommand.parsedMessage)) {
      const newCommand = parsedCommand.parsedMessage.command?.botCommandParams;
      if (newCommand) {
        const newCommandParts = newCommand.split(' ');
        if (newCommandParts.length > 1) {
          const newCommandName = newCommandParts[0];
          const command = Commands.findOneByCommandId(newCommandName);
          if (command) {
            return sendChatMessage(connection, `The command ${newCommandName} already exists!`);
          }

          const isoString = new Date().toISOString();
          const newCommand: Command = {
            command: [newCommandName],
            commandId: newCommandName,
            message: newCommandParts.splice(1).join(' '),
            description: '',
            cooldown: 0,
            timesUsed: 0,
            createdAt: isoString,
            updatedAt: isoString,
          };
          Commands.saveOne(newCommand);
          loadBotCommands();
          sendChatMessage(connection, `The command ${newCommandName} has been added!`);
        }
      }
    }
  },
};
