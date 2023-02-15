import type { Command } from '../../models/command-model';
import type { BotCommand } from '../../types';
import { endWithFullStop } from '../../utils/endWithFullStop';
import { msToTimeString } from '../../utils/msToTimeString';

export const generateCommandMessage = (commandName: string, botCommand: BotCommand, commandData: Command) => {
  const start = `You want to know about ${commandName}? Here's what we know:`;
  const description = botCommand.description ?? '';
  const useBy = botCommand.mustBeUser ? `It may only be used by ${botCommand.mustBeUser.join(',')}.` : '';
  const cooldown = botCommand.cooldown ? `It may only be used once every ${msToTimeString(botCommand.cooldown)}` : '';
  const aliases =
    Array.isArray(botCommand.command) && botCommand.command.length > 1
      ? `It can be invoked using ${botCommand.command.length} aliases: ${botCommand.command.join(', ')}`
      : '';
  const timesUsed = `It has been used ${commandData.timesUsed} times`;

  return [start, description, useBy, cooldown, aliases, timesUsed]
    .filter((text) => !!text)
    .map((text) => endWithFullStop(text))
    .join(' ');
};
