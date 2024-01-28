import { loadBotCommands } from '../botCommands';
import Config from '../config';
import { SECOND_MS } from '../constants';
import { fetchGameByName } from '../handlers/twitch/helix/fetchGameByName';
import { setStreamGame } from '../handlers/twitch/helix/setStreamGame';
import { setStreamTags } from '../handlers/twitch/helix/setStreamTags';
import { getIO } from '../runSocketServer';
import { Commands } from '../storage-models/command-model';
import type { Task } from '../storage-models/task-model';
import { Tasks } from '../storage-models/task-model';
import type { BotCommand } from '../types';
import { findBotCommand } from './helpers/findBotCommand';
import { isAllowedUser } from './helpers/isAllowedUser';
import { parsedMessageHasAllProps } from './helpers/parsedMessageHasAllProps';
import { sendChatMessage } from './helpers/sendChatMessage';

const setHelpText = `The possible set commands are: alias, category, cooldown, description, message, tags, task, title`;

export const set: BotCommand = {
  command: 'set',
  id: 'set',
  privileged: true,
  hidden: true,
  description: 'Set command with several options',
  cooldown: 1 * SECOND_MS,
  callback: async (connection, parsedCommand) => {
    const nick = parsedCommand.parsedMessage.source?.nick;
    if (!nick) {
      return;
    }

    const setParams = parsedCommand.parsedMessage.command?.botCommandParams;
    if (!setParams) {
      sendChatMessage(connection, `Set needs to be used with parameters. Use !set help for more information.`);
      return;
    }

    const newCommandParts = setParams.split(' ');

    if (newCommandParts.length === 1) {
      if (newCommandParts[0] === 'help') {
        sendChatMessage(connection, setHelpText);
      } else {
        sendChatMessage(connection, `Set needs to be used with parameters. Use !set help for more information.`);
      }
      return;
    }

    const commandName = newCommandParts[0];
    const commandParams = newCommandParts.splice(1).join(' ');
    const isoDate = new Date().toISOString();
    const subCommandParts = commandParams.split(' ');

    switch (commandName) {
      case 'alias': {
        if (subCommandParts.length > 1) {
          const commandName = subCommandParts[0];
          const commandAlias = subCommandParts[1];

          const foundBotCommand = findBotCommand(commandName);
          if (!foundBotCommand) {
            sendChatMessage(connection, `Unable to find a command with the name ${commandName}.`);
            return;
          }
          const command = Commands.findOneByCommandId(foundBotCommand.id);
          if (!command) {
            sendChatMessage(connection, `Unable to find a command with the name ${commandName}.`);
            return;
          }
          if (command && command.command) {
            if (Array.isArray(command.command)) {
              command.command = [...command.command, commandAlias];
            } else {
              command.command = [command.command, commandAlias];
            }
            command.updatedAt = new Date().toISOString();
            Commands.saveOne(command);
            loadBotCommands();
            sendChatMessage(connection, `The alias for the command ${commandName} has been added!`);
          } else {
            sendChatMessage(connection, `Unable to find a command with the name ${commandName}.`);
          }
        }
        break;
      }
      case 'category': {
        if (!isAllowedUser(nick, [Config.twitch.account])) {
          return;
        }
        const newCategory = commandParams;
        if (newCategory) {
          const game = await fetchGameByName(newCategory);
          if (game) {
            await setStreamGame(game.id);
            sendChatMessage(connection, `Category updated to ${newCategory} 🎉`);
          }
        }
        break;
      }
      case 'cooldown': {
        if (subCommandParts.length > 1) {
          const commandName = subCommandParts[0];
          const newCommandCooldown = Number(subCommandParts[1]);
          if (isNaN(newCommandCooldown) || newCommandCooldown <= 0) {
            sendChatMessage(connection, `Invalid cooldown parameter provided.`);
            return;
          }
          const foundBotCommand = findBotCommand(commandName);
          if (!foundBotCommand) {
            sendChatMessage(connection, `Unable to find a command with the name ${commandName}.`);
            return;
          }
          const command = Commands.findOneByCommandId(foundBotCommand.id);
          if (!command) {
            sendChatMessage(connection, `Unable to find a command with the name ${commandName}.`);
            return;
          }
          command.cooldown = newCommandCooldown;
          command.updatedAt = new Date().toISOString();
          Commands.saveOne(command);
          loadBotCommands();
          sendChatMessage(connection, `The cooldown for the command ${commandName} has been updated!`);
        }
        break;
      }
      case 'description': {
        if (subCommandParts.length > 1) {
          const commandName = subCommandParts[0];
          const newCommandDescrition = subCommandParts.splice(1).join(' ');
          const foundBotCommand = findBotCommand(commandName);
          if (!foundBotCommand) {
            sendChatMessage(connection, `Unable to find a command with the name ${commandName}.`);
            return;
          }
          const command = Commands.findOneByCommandId(foundBotCommand.id);
          if (!command) {
            sendChatMessage(connection, `Unable to find a command with the name ${commandName}.`);
            return;
          }
          if (command) {
            command.description = newCommandDescrition;
            command.updatedAt = new Date().toISOString();
            Commands.saveOne(command);
            loadBotCommands();
            sendChatMessage(connection, `The description for the command ${commandName} has been updated!`);
          } else {
            sendChatMessage(connection, `Unable to find a command with the name ${commandName}.`);
          }
        }
        break;
      }
      case 'message': {
        if (subCommandParts.length > 1) {
          const commandName = subCommandParts[0];
          const newCommandMessage = subCommandParts.splice(1).join(' ');
          const foundBotCommand = findBotCommand(commandName);
          if (!foundBotCommand) {
            sendChatMessage(connection, `Unable to find a command with the name ${commandName}.`);
            return;
          }
          const command = Commands.findOneByCommandId(foundBotCommand.id);
          if (!command) {
            sendChatMessage(connection, `Unable to find a command with the name ${commandName}.`);
            return;
          }
          if (command) {
            command.message = newCommandMessage;
            command.updatedAt = new Date().toISOString();
            Commands.saveOne(command);
            loadBotCommands();
            sendChatMessage(connection, `The message for the command ${commandName} has been updated!`);
          } else {
            sendChatMessage(connection, `Unable to find a command with the name ${commandName}.`);
          }
        }
        break;
      }
      case 'tags': {
        if (commandParams.length === 0) {
          return sendChatMessage(connection, `modCheck tags?`);
        }

        const newTags: string[] = commandParams.includes(',') ? commandParams.split(',') : commandParams.split(' ');

        if (newTags.length === 0) {
          return sendChatMessage(connection, `modCheck tags?`);
        }

        if (newTags.length > 10) {
          return sendChatMessage(connection, `Too many tags! Maximum of 10 allowed.`);
        }

        if (!newTags.every((t) => t.length <= 25)) {
          return sendChatMessage(connection, `One or more tag is too long. Maximum length of a tag is 25`);
        }

        await setStreamTags(newTags);
        sendChatMessage(connection, `Tags updated to ${newTags.join(', ')} 🎉`);

        break;
      }
      case 'task': {
        if (parsedMessageHasAllProps(parsedCommand.parsedMessage)) {
          const taskMessage = commandParams;
          const task: Task = {
            content: parsedCommand.parsedMessage,
            message: taskMessage,
            updatedAt: isoDate,
            createdAt: isoDate,
          };
          Tasks.data = [...Tasks.data, task];
          Tasks.save();
          sendChatMessage(connection, `Task successfully updated 🎉`);
          getIO().emit('task', parsedCommand.parsedMessage);
        }
        break;
      }
      case 'title': {
        const newTitle = commandParams;
        if (newTitle) {
          await setStreamGame(newTitle);
          sendChatMessage(connection, `Title updated to ${newTitle} 🎉`);
        }
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
