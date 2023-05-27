import { playSound } from '../playSound';
import type { BotCommand } from '../types';
import { sendChatMessage } from './helpers/sendChatMessage';

export const party: BotCommand = {
  command: 'party',
  id: 'party',
  privileged: true,
  description: 'Starts a party',
  callback: async (connection) => {
    sendChatMessage(connection, 'Time to party! 🎉');
    await playSound('party');
  },
  cooldown: 10000,
};
