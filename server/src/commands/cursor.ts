import type { BotCommand } from '../types';
import { sendChatMessage } from './helpers/sendChatMessage';

export const cursor: BotCommand = {
  command: 'cursor',
  id: 'cursor',
  description: 'Do you like how the VSCode cursor moves?',
  callback: (connection) =>
    sendChatMessage(
      connection,
      `"editor.cursorBlinking": "expand",
      "editor.cursorWidth": 3,
      "editor.cursorSmoothCaretAnimation": true,`,
    ),
};
