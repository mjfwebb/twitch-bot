import { playSound } from '../playSound';
import type { BotCommand } from '../types';

export const fail: BotCommand = {
  command: 'fail',
  id: 'fail',
  description: 'Used when something does not go well',
  callback: async () => {
    await playSound('fail');
  },
  cooldown: 10000,
};
