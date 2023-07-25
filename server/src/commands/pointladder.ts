import { SECOND_MS } from '../constants';
import { Users } from '../storage-models/user-model';
import type { BotCommand } from '../types';
import { sendChatMessage } from './helpers/sendChatMessage';

export const pointladder: BotCommand = {
  command: ['pointladder', 'pl', 'pointsladder'],
  id: 'pointladder',
  cooldown: 5 * SECOND_MS,
  description: 'Check who is on the point ladder and how many points they have',
  callback: (connection) => {
    const users = Users.data.sort((a, b) => b.points - a.points);
    users.length = 5;
    sendChatMessage(
      connection,
      `Top 5 point ladder: ${users
        .filter((user) => user.points > 0)
        .map((user) => `${user.displayName} (${user.points})`)
        .join(', ')}`,
    );
  },
};
