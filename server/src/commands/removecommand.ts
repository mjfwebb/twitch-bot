import type { BotCommand } from '../types';
import { hasBotCommandParams } from './helpers/hasBotCommandParams';
import { sendChatMessage } from './helpers/sendChatMessage';
import { loadBotCommands } from '../botCommands';
import CommandModel from '../models/command-model';

export const removecommand: BotCommand = {
  command: 'removecommand',
  id: 'removecommand',
  priviliged: true,
  hidden: true,
  description: '',
  callback: async (connection, parsedMessage) => {
    if (hasBotCommandParams(parsedMessage)) {
      const commandId = parsedMessage.command?.botCommandParams;
      if (commandId) {
        const newCommandParts = commandId.split(' ');
        if (newCommandParts.length > 1) {
          return sendChatMessage(connection, 'Huh?');
        }
        const command = await CommandModel.findOne({ commandId });
        if (command) {
          await CommandModel.deleteOne({ commandId });
          await loadBotCommands();
          sendChatMessage(connection, `The command ${commandId} has been removed!`);
        }
      }
    }
  },
};
