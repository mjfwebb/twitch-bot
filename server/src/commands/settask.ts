import { SECOND_MS } from '../constants';
import TaskModel from '../models/task-model';
import { getIO } from '../runSocketServer';
import type { BotCommand } from '../types';
import { hasBotCommandParams } from './helpers/hasBotCommandParams';
import { sendChatMessage } from './helpers/sendChatMessage';

export const settask: BotCommand = {
  command: 'settask',
  id: 'settask',
  mustBeUser: ['athano', 'jumpylionnn'],
  description: 'Sets the current task',
  cooldown: 5 * SECOND_MS,
  callback: async (connection, parsedCommand) => {
    if (hasBotCommandParams(parsedCommand.parsedMessage)) {
      const task = new TaskModel({
        content: parsedCommand.parsedMessage,
      });
      await task.save();
      sendChatMessage(connection, `Task successfully updated 🎉`);
      getIO().emit('task', parsedCommand.parsedMessage);
    }
  },
};
