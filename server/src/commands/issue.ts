import open from 'open';
import type { BotCommand } from '../types';

export const issue: BotCommand = {
  command: 'issue',
  id: 'issue',
  mustBeUser: ['athano'],
  priviliged: true,
  hidden: true,
  callback: async () => {
    await open('https://github.com/mjfwebb/twitch-bot/issues/new');
  },
};
