import { MINUTE_MS } from '../constants';
import { banUser } from '../handlers/twitch/helix/moderation';
import type { BotCommand } from '../types';

const DURATION_S = 5;

export const vanish: BotCommand = {
  command: ['vanish'],
  id: 'vanish',
  cooldown: 5 * MINUTE_MS,
  callback: (connection, parsedCommand) => {
    const userId = parsedCommand.parsedMessage.tags?.['user-id'];
    if (userId) {
      void banUser(userId, DURATION_S);
    }
  },
};
