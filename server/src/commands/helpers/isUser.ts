import type { ParsedMessage } from '../../types';

export function isUser(message: ParsedMessage, allowedUsers: string[]): boolean {
  const username = message.source?.nick;

  if (!username) {
    return false;
  }

  return allowedUsers.includes(username);
}
