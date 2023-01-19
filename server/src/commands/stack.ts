import type { BotCommand } from '../types';
import { sendChatMessage } from './helpers/sendChatMessage';

export const stack: BotCommand = {
  command: 'stack',
  id: 'stack',
  description: 'The real stack command. These are the technologies used',
  callback: (connection) => {
    sendChatMessage(connection, 'Typescript, React, NodeJS, Socket.io, mongoDB (Mongoose), Digital Ocean droplet, Firebase');
  },
};
