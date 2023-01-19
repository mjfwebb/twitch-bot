import { playSound } from '../playSound';
import type { BotCommand } from '../types';

export const wary: BotCommand = {
  command: ['wary', 'Wary'],
  id: 'wary',
  description: 'Just listen to it',
  callback: async () => {
    await playSound('oh_great_heavens');
  },
};
