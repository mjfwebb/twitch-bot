import type { ParsedMessage } from '../types';

export function isUser(message: ParsedMessage, user: string): boolean {
  return message.source?.nick === user;
}
