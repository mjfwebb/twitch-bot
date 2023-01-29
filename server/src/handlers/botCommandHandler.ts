import type websocket from 'websocket';

import { isPrivileged } from '../commands/helpers/isPrivileged';
import { isUser } from '../commands/helpers/isUser';
import type { BotCommandCooldown, ParsedMessage } from '../types';
import { getBotCommands } from '../botCommands';
import { sendChatMessage } from '../commands/helpers/sendChatMessage';
import CommandModel from '../models/command-model';

const cooldowns: BotCommandCooldown[] = [];
const messageQueue: ParsedMessage[] = [];
let workingQueue = false;

export const skipCurrentCommand = () => {
  messageQueue.splice(0, 1);
  workingQueue = false;
};

function findCommand(parsedMessage: ParsedMessage) {
  return getBotCommands().find((bc) => {
    if (parsedMessage.command && parsedMessage.command.botCommand) {
      if (Array.isArray(bc.command)) {
        return bc.command.includes(parsedMessage.command.botCommand);
      } else {
        return bc.command === parsedMessage.command.botCommand;
      }
    }
  });
}

async function handleCommand(connection: websocket.connection, parsedMessage: ParsedMessage) {
  const foundBotCommand = findCommand(parsedMessage);

  if (foundBotCommand) {
    if (foundBotCommand.priviliged && !isPrivileged(parsedMessage)) {
      return;
    }

    if (foundBotCommand.mustBeUser && !isUser(parsedMessage, foundBotCommand.mustBeUser)) {
      return;
    }

    const result = await foundBotCommand.callback(connection, parsedMessage);
    if (typeof result === 'boolean' && result === false) {
      sendChatMessage(connection, `That's not right. Use !help ${parsedMessage.command?.botCommand || ''} to get more information`);
    } else {
      await CommandModel.updateOne({ commandId: foundBotCommand.id }, { $inc: { timesUsed: 1 } }, { upsert: true });
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

function addCooldown(commandId: string, cooldownLength = 0) {
  const cooldownIndex = cooldowns.findIndex((cooldown) => cooldown.commandId === commandId);

  if (cooldownIndex > -1) {
    cooldowns[cooldownIndex] = {
      commandId,
      unusableUntil: Date.now() + cooldownLength,
    };
  } else {
    cooldowns.push({ commandId, unusableUntil: Date.now() + cooldownLength });
  }
}

export async function botCommandHandler(connection: websocket.connection, parsedMessage: ParsedMessage) {
  const foundBotCommand = findCommand(parsedMessage);

  const cooldown = cooldowns.find((cooldown) => cooldown.commandId === foundBotCommand?.id);

  if (cooldown && cooldown.unusableUntil > Date.now()) {
    return;
  }

  if (foundBotCommand) {
    addCooldown(foundBotCommand.id, foundBotCommand.cooldown);
    messageQueue.push(parsedMessage);
    await workQueue(connection);
    return;
  }
}
