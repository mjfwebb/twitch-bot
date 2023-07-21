import { Commands } from '../storage-models/command-model';
import type { BotCommand } from '../types';
import { findBotCommand } from './helpers/findBotCommand';
import { generateCommandMessage } from './helpers/generateCommandMessage';
import { hasBotCommandParams } from './helpers/hasBotCommandParams';
import { sendChatMessage } from './helpers/sendChatMessage';

export const help: BotCommand = {
  command: ['help'],
  id: 'command',
  description: 'Use this command to find out more about a command',
  callback: (connection, parsedCommand) => {
    if (hasBotCommandParams(parsedCommand.parsedMessage)) {
      const commandToGetDetailsAbout = parsedCommand.parsedMessage.command?.botCommandParams?.replace('!', '');
      if (!commandToGetDetailsAbout) {
        sendChatMessage(connection, 'You need to specify a command to get details about, like !help !play');
        return;
      }
      const foundBotCommand = findBotCommand(commandToGetDetailsAbout);
      if (!foundBotCommand) {
        sendChatMessage(connection, "I don't know about that command");
        return;
      }
      const command = Commands.findOneByCommandId(foundBotCommand.id);
      const message = generateCommandMessage(commandToGetDetailsAbout, foundBotCommand, command?.timesUsed || 0);
      sendChatMessage(connection, message);
    }
  },
  cooldown: 5000,
};
