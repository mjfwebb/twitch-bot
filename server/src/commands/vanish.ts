import { MINUTE_MS } from '../constants';
import { banUser } from '../handlers/twitch/helix/moderation';
import { sendChatMessage } from './helpers/sendChatMessage';
import type { BotCommand } from '../types';

const DURATION_S = 1;

export const vanish: BotCommand = {
  command: ['vanish'],
  id: 'vanish',
  cooldown: 5 * MINUTE_MS,
  callback: (connection, parsedCommand) => {
    const userId = parsedCommand.parsedMessage.tags?.['user-id'];
    const isModerator = parsedCommand.parsedMessage.tags?.mod === '1';

    if (isModerator) {
      sendChatMessage(connection, "I won't timeout a moderator!");
      return;
    }

    if (userId) {
      void banUser(userId, DURATION_S);
    }
  },
};
