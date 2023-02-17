import type { BotCommand } from '../types';
import { findBotCommand } from './helpers/findBotCommand';
import { findOrCreateCommand } from './helpers/findOrCreateCommand';
import { generateCommandMessage } from './helpers/generateCommandMessage';
import { hasBotCommandParams } from './helpers/hasBotCommandParams';
import { sendChatMessage } from './helpers/sendChatMessage';

export const help: BotCommand = {
  command: ['help'],
  id: 'command',
  description: 'Use this command to find out more about a command',
  callback: async (connection, parsedCommand) => {
    if (hasBotCommandParams(parsedCommand.parsedMessage)) {
      const commandToGetDetailsAbout = parsedCommand.parsedMessage.command?.botCommandParams;
      if (!commandToGetDetailsAbout) {
        return;
      }
      const foundBotCommand = findBotCommand(commandToGetDetailsAbout);
      if (!foundBotCommand) {
        sendChatMessage(connection, "I don't know about that command");
        return;
      }
      const commandData = await findOrCreateCommand(foundBotCommand.id);
      const message = generateCommandMessage(commandToGetDetailsAbout, foundBotCommand, commandData);
      sendChatMessage(connection, message);
    }
  },
  cooldown: 5000,
};
