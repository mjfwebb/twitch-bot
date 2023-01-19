import { MINUTE_MS } from '../constants';
import type { BotCommand } from '../types';
import { sendChatMessage } from './helpers/sendChatMessage';

export const elephant: BotCommand = {
  command: 'elephant',
  id: 'elephant',
  description: 'Just look at it',
  cooldown: 1 * MINUTE_MS,
  callback: (connection) => {
    sendChatMessage(
      connection,
      // eslint-disable-next-line max-len
      '░▒░█░░░░░░░░░░░░░░░░ ░░░█░░░░░░░░░░░░░░░░ ░░█░░░░███████░░░░░░ ░██░░░██▓▓███▓██▒░░░ ██░░░█▓▓▓▓▓▓▓█▓████░ ██░░██▓▓▓(O)▓█▓█▓█░░ ███▓▓▓█▓▓▓▓▓█▓█▓▓▓▓█ ▀██▓▓█░██▓▓▓▓██▓▓▓▓▓█ ░▀██▀░░█▓▓▓▓▓▓▓▓▓▓▓▓▓█ ░░░░▒░░░█▓▓▓▓▓█▓▓▓▓▓▓█ ░░░░▒░░░█▓▓▓▓█▓█▓▓▓▓▓█ ░▒░░▒░░░█▓▓▓█▓▓▓█▓▓▓▓█ ░▒░░▒░░░█▓▓▓█░░░█▓▓▓█ ░▒░░▒░░██▓██░░░██▓▓██',
    );
  },
};
