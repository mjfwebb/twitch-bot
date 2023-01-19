import type { BotCommand } from '../types';
import { sendChatMessage } from './helpers/sendChatMessage';

export const links: BotCommand = {
  command: ['links'],
  id: 'links',
  description: 'Get links for related webpages',
  callback: (connection) =>
    sendChatMessage(
      connection,
      '🚀 Game: https://www.betweenworlds.net 🚀 Discord: https://discord.betweenworlds.net 🚀 Patreon: https://www.patreon.com/athano 🚀 Twitter: https://twitter.com/athanoquest',
    ),
};
