import { SECOND_MS } from '../constants';
import { fetchChannelInformation } from '../handlers/twitch/helix/fetchChannelInformation';
import { Tasks } from '../storage-models/task-model';
import { StreamState } from '../streamState';
import type { BotCommand } from '../types';
import { sendChatMessage } from './helpers/sendChatMessage';

const setHelpText = `The possible get commands are: category, tags, task, title`;

export const get: BotCommand = {
  command: 'get',
  id: 'get',
  privileged: true,
  hidden: true,
  description: 'Get command with several options',
  cooldown: 1 * SECOND_MS,
  callback: async (connection, parsedCommand) => {
    const getParams = parsedCommand.parsedMessage.command?.botCommandParams;
    if (!getParams) {
      return;
    }

    const newCommandParts = getParams.split(' ');
    const commandName = newCommandParts[0];

    switch (commandName) {
      case 'category': {
        const category = (await fetchChannelInformation())?.game_name;
        if (category) {
          StreamState.category = category;
        }
        sendChatMessage(connection, `The current category is ${StreamState.category}`);
        break;
      }
      case 'tags': {
        const currentTags = (await fetchChannelInformation())?.tags;
        if (currentTags) {
          sendChatMessage(connection, `Current tags are: ${currentTags.join(', ')}`);
        }
        break;
      }
      case 'task': {
        const task = Tasks.data[Tasks.data.length - 1];
        if (task) {
          sendChatMessage(connection, `Current task: ${task.message}`);
        } else {
          sendChatMessage(connection, 'No current task!');
        }
        break;
      }
      case 'title': {
        await fetchChannelInformation();
        sendChatMessage(connection, `The current title is ${StreamState.title}`);
        break;
      }
      case 'help': {
        sendChatMessage(connection, setHelpText);
        break;
      }
      default:
        sendChatMessage(connection, setHelpText);
        break;
    }
  },
};
