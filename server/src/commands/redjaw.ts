import type { BotCommand } from '../types';
import { sendChatMessage } from './helpers/sendChatMessage';

export const redjaw: BotCommand = {
  command: 'redjaw',
  id: 'redjaw',
  description: 'Welcome to the Riazey gang!',
  callback: (connection) => {
    sendChatMessage(connection, 'Welcome to the Riazey gang! https://www.twitch.tv/riazey/clip/HotArtsyPuddingGOWSkull-s0cm7S54szpZ6VNy');
  },
};
