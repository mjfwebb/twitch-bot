import { playSound } from '../playSound';
import type { BotCommand } from '../types';

export const success: BotCommand = {
  command: 'success',
  id: 'success',
  description: 'Used when something goes well',
  priviliged: true,
  callback: async () => {
    await playSound('success');
  },
  cooldown: 10000,
};
