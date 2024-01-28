import Config from '../config';
import { SECOND_MS } from '../constants';
import { getIO } from '../runSocketServer';
import type { Task } from '../storage-models/task-model';
import { Tasks } from '../storage-models/task-model';
import type { BotCommand } from '../types';
import { parsedMessageHasAllProps } from './helpers/parsedMessageHasAllProps';
import { sendChatMessage } from './helpers/sendChatMessage';

export const settask: BotCommand = {
  command: 'settask',
  id: 'settask',
  mustBeUser: [Config.twitch.account],
  description: 'Sets the current task',
  cooldown: 5 * SECOND_MS,
  callback: (connection, parsedCommand) => {
    if (parsedMessageHasAllProps(parsedCommand.parsedMessage)) {
      const isoDate = new Date().toISOString();
      const task: Task = {
        content: parsedCommand.parsedMessage,
        updatedAt: isoDate,
        createdAt: isoDate,
      };
      Tasks.data = [...Tasks.data, task];
      Tasks.save();
      sendChatMessage(connection, `Task successfully updated 🎉`);
      getIO().emit('task', parsedCommand.parsedMessage);
    }
  },
};
