import type websocket from 'websocket';

import { isPrivileged } from '../helpers/isPrivileged';
import { isUser } from '../helpers/isUser';
import type { BotCommandCooldown, ParsedMessage } from '../types';
import { botCommands } from './botCommands';

const cooldowns: BotCommandCooldown[] = [];
const messageQueue: ParsedMessage[] = [];
let workingQueue = false;

async function handleCommand(connection: websocket.connection, parsedMessage: ParsedMessage) {
  const foundBotCommand = botCommands.find((bc) => bc.command === parsedMessage.command?.botCommand);
  if (foundBotCommand) {
    if (foundBotCommand.priviliged && !isPrivileged(parsedMessage)) {
      return;
    }

    if (foundBotCommand.mustBeUser && !isUser(parsedMessage, foundBotCommand.mustBeUser)) {
      return;
    }

    if (foundBotCommand.playTime && foundBotCommand.playTime > 0) {
      await new Promise<void>((resolve) => {
        foundBotCommand.callback(connection, parsedMessage);
        setTimeout(() => resolve(), foundBotCommand.playTime);
      });
    } else {
      foundBotCommand.callback(connection, parsedMessage);
    }
  }
}

async function workQueue(connection: websocket.connection) {
  while (messageQueue.length > 0 && workingQueue === false) {
    workingQueue = true;
    const messageToWork = messageQueue[0];
    await handleCommand(connection, messageToWork);
    messageQueue.splice(0, 1);
    workingQueue = false;
  }
}

function addCooldown(command: string, cooldownLength = 0) {
  const cooldownIndex = cooldowns.findIndex((cooldown) => cooldown.command === command);

  if (cooldownIndex > -1) {
    cooldowns[cooldownIndex] = {
      command,
      unusableUntil: Date.now() + cooldownLength,
    };
  } else {
    cooldowns.push({ command, unusableUntil: Date.now() + cooldownLength });
  }
}

export async function botCommandHandler(connection: websocket.connection, parsedMessage: ParsedMessage) {
  const botCommand = parsedMessage.command?.botCommand;

  const cooldown = cooldowns.find((cooldown) => cooldown.command === botCommand);

  if (cooldown && cooldown.unusableUntil > Date.now()) {
    return;
  }

  if (botCommand) {
    const foundBotCommand = botCommands.find((bc) => bc.command === parsedMessage.command?.botCommand);
    if (foundBotCommand) {
      addCooldown(foundBotCommand.command, foundBotCommand.cooldown);
      messageQueue.push(parsedMessage);
      await workQueue(connection);
      return;
    }
  }
}
