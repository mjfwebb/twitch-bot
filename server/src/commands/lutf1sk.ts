import { MINUTE_MS } from '../constants';
import { banUser, unbanUser } from '../handlers/twitch/helix/moderation';
import type { BotCommand } from '../types';
import { promiseAsyncWrapper } from '../utils/promiseAsyncWrapper';
import { sendChatMessage } from './helpers/sendChatMessage';

export const lutf1sk: BotCommand = {
  command: ['lutf1sk', 'lutfisk'],
  id: 'lutf1sk',
  mustBeUser: ['lutf1sk'],
  description: 'It allows lutf1sk to ban himself',
  callback: async (connection, parsedMessage) => {
    const userId = parsedMessage.tags?.['user-id'];
    if (userId) {
      sendChatMessage(connection, 'Get banned fool');
      setTimeout(() => {
        promiseAsyncWrapper(() => unbanUser(userId));
      }, 10000);
      await banUser(userId);
    }
  },
  cooldown: 30 * MINUTE_MS,
};
