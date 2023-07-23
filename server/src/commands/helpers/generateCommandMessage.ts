import type { BotCommand } from '../../types';
import { endWithFullStop } from '../../utils/endWithFullStop';
import { msToTimeString } from '../../utils/msToTimeString';
import { simplePluralise } from '../../utils/simplePluralise';

export const generateCommandMessage = (commandName: string, botCommand: BotCommand, timesUsed: number) => {
  const start = `You want to know about ${commandName}? Here's what we know:`;
  const description = botCommand.description ?? '';
  const useBy = botCommand.mustBeUser ? `It may only be used by ${botCommand.mustBeUser.join(',')}.` : '';
  const cooldown = botCommand.cooldown ? `It may only be used once every ${msToTimeString(botCommand.cooldown)}` : '';
  const aliases =
    Array.isArray(botCommand.command) && botCommand.command.length > 1
      ? `It can be invoked using ${botCommand.command.length} aliases: ${botCommand.command.join(', ')}`
      : '';
  const commandTimesUsed = `It has been used ${timesUsed} ${simplePluralise('time', timesUsed)}.`;

  return [start, description, useBy, cooldown, aliases, commandTimesUsed]
    .filter((text) => !!text)
    .map((text) => endWithFullStop(text))
    .join(' ');
};
