import { BOTNAMES, SECOND_MS } from '../constants';
import { fetchChatters } from '../handlers/fetchChatters';
import { sendChatMessage } from './helpers/sendChatMessage';
import type { BotCommand } from '../types';

export const viewers: BotCommand = {
  command: 'viewers',
  id: 'viewers',
  cooldown: 5 * SECOND_MS,
  callback: async (connection) => {
    const chatters = await fetchChatters();
    const viewerCount = chatters.filter((chatter) => !BOTNAMES.includes(chatter.user_login)).length;
    sendChatMessage(connection, `Currently there are ${viewerCount} viewers 👀`);
  },
};
