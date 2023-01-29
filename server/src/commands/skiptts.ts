import { clearCurrentSound } from '../playSound';
import type { BotCommand } from '../types';

export const skiptts: BotCommand = {
  command: 'skiptts',
  id: 'skiptts',
  priviliged: true,
  hidden: true,
  callback: () => {
    clearCurrentSound();
  },
};
