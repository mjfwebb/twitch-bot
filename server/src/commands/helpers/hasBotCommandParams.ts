import type { ParsedMessage, ParsedMessageWithCommand } from '../../types';

export function hasBotCommandParams(parsedMessage: ParsedMessage): parsedMessage is ParsedMessageWithCommand {
  return !!parsedMessage.command?.botCommandParams;
}
