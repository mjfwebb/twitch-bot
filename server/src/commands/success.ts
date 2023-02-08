import { playSound } from '../playSound';
import { getIO } from '../runSocketServer';
import type { BotCommand } from '../types';

export const success: BotCommand = {
  command: 'success',
  id: 'success',
  description: 'Used when something goes well',
  priviliged: true,
  callback: async () => {
    getIO().emit('confetti');
    await playSound('success');
  },
  cooldown: 10000,
};
