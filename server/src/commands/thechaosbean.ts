import { playSound } from '../playSound';
import type { BotCommand } from '../types';

export const thechaosbean: BotCommand = {
  command: 'thechaosbean',
  id: 'thechaosbean',
  description: "It's a party",
  callback: async () => {
    await playSound('party');
  },
};
