import type { ParsedMessage } from '../types';

export function hasBotCommandParams(parsedMessage: ParsedMessage): boolean {
  return !!parsedMessage.command?.botCommandParams;
}
