import { botCommands } from '../botCommands';
import type { BotCommand } from '../types';
import { endWithFullStop } from '../utils/endWithFullStop';
import { msToTimeString } from '../utils/msToTimeString';
import { sendChatMessage } from './helpers/sendChatMessage';

export const command: BotCommand = {
  command: 'command',
  id: 'command',
  description: 'Use this command to find out more about a command',
  callback: (connection, parsedMessage) => {
    const commandParam = parsedMessage.command?.botCommandParams;

    if (commandParam) {
      const foundCommand = botCommands.find((command) => {
        if (Array.isArray(command.command)) {
          return command.command.includes(commandParam);
        } else {
          return command.command === commandParam;
        }
      });

      if (!foundCommand || foundCommand.hidden) {
        sendChatMessage(connection, `I don't know what the command ${commandParam} is?!`);
      } else {
        const start = `You want to know about ${commandParam}? Here's what we know:`;
        const description = foundCommand.description ?? '';
        const useBy = foundCommand.mustBeUser ? `It may only be used by ${foundCommand.mustBeUser}.` : '';
        const cooldown = foundCommand.cooldown ? `It may only be used once every ${msToTimeString(foundCommand.cooldown)}` : '';
        const aliases =
          Array.isArray(foundCommand.command) && foundCommand.command.length > 1
            ? `It can be invoked using ${foundCommand.command.length} aliases: ${foundCommand.command.join(', ')}`
            : '';

        sendChatMessage(
          connection,
          [start, description, useBy, cooldown, aliases]
            .filter((text) => !!text)
            .map((text) => endWithFullStop(text))
            .join(' '),
        );
      }
    }
  },
  cooldown: 5000,
};
