import type { BotCommand } from '../types';
import { sendChatMessage } from './helpers/sendChatMessage';

export const discord: BotCommand = {
  command: ['discord', 'd'],
  id: 'discord',
  description: 'The Between Worlds discord link',
  callback: (connection) => sendChatMessage(connection, 'Between Worlds Discord server: https://discord.betweenworlds.net'),
};
