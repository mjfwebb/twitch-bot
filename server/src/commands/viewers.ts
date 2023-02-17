import { SECOND_MS } from '../constants';
import { fetchChatters } from '../handlers/twitch/helix/fetchChatters';
import { sendChatMessage } from './helpers/sendChatMessage';
import type { BotCommand } from '../types';
import { getTwitchViewerBotNames } from '../handlers/twitchinsights/twitchViewerBots';

export const viewers: BotCommand = {
  command: 'viewers',
  id: 'viewers',
  cooldown: 5 * SECOND_MS,
  callback: async (connection) => {
    const chatters = await fetchChatters();
    const viewerCount = chatters.filter((chatter) => !getTwitchViewerBotNames().includes(chatter.user_login)).length;
    sendChatMessage(connection, `Currently there are ${viewerCount} viewers 👀`);
  },
};
