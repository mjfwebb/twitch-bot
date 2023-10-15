import type websocket from "websocket";

import { findBotCommand } from "../commands/helpers/findBotCommand";
import { isPrivileged } from "../commands/helpers/isPrivileged";
import { isUser } from "../commands/helpers/isUser";
import { sendChatMessage } from "../commands/helpers/sendChatMessage";
import { Commands } from "../storage-models/command-model";
import type {
  BotCommandCooldown,
  ParsedCommand,
  ParsedMessage,
} from "../types";

const cooldowns: BotCommandCooldown[] = [];
const commandQueue: ParsedCommand[] = [];
let workingQueue = false;

export const skipCurrentCommand = () => {
  commandQueue.splice(0, 1);
  workingQueue = false;
};

async function handleCommand(
  connection: websocket.connection,
  queuedCommand: ParsedCommand,
) {
  const result = await queuedCommand.botCommand.callback(
    connection,
    queuedCommand,
  );
  if (typeof result === "boolean" && result === false) {
    sendChatMessage(
      connection,
      `That's not right. Use !help ${queuedCommand.commandName} to get more information`,
    );
  } else {
    const command = Commands.findOneByCommandId(queuedCommand.botCommand.id);
    if (command) {
      Commands.increaseTimesUsed(command);
    } else {
      // If the command doesn't exist as a stored command, but instead as a file,
      // then we create it so we can store the times used
      const isoString = new Date().toISOString();
      Commands.saveOne({
        command: [queuedCommand.commandName],
        commandId: queuedCommand.botCommand.id,
        message: "",
        timesUsed: 1,
        cooldown: queuedCommand.botCommand.cooldown || 0,
        description: queuedCommand.botCommand.description || "",
        createdAt: isoString,
        updatedAt: isoString,
      });
    }
  }
}

async function workQueue(connection: websocket.connection) {
  while (commandQueue.length > 0 && workingQueue === false) {
    workingQueue = true;
    const messageToWork = commandQueue[0];
    await handleCommand(connection, messageToWork);
    commandQueue.splice(0, 1);
    workingQueue = false;
  }
}

function addCooldown(commandId: string, cooldownLength = 0) {
  const cooldownIndex = cooldowns.findIndex(
    (cooldown) => cooldown.commandId === commandId,
  );

  if (cooldownIndex > -1) {
    cooldowns[cooldownIndex] = {
      commandId,
      unusableUntil: Date.now() + cooldownLength,
    };
  } else {
    cooldowns.push({ commandId, unusableUntil: Date.now() + cooldownLength });
  }
}

export async function botCommandHandler(
  connection: websocket.connection,
  parsedMessage: ParsedMessage,
): Promise<void> {
  const commandName = parsedMessage.command?.botCommand;
  if (!commandName) {
    return;
  }

  const botCommand = findBotCommand(commandName);
  if (!botCommand) {
    return;
  }

  const cooldown = cooldowns.find(
    (cooldown) => cooldown.commandId === botCommand.id,
  );
  if (cooldown && cooldown.unusableUntil > Date.now()) {
    return;
  }

  if (botCommand.privileged && !isPrivileged(parsedMessage)) {
    return;
  }

  if (botCommand.mustBeUser && !isUser(parsedMessage, botCommand.mustBeUser)) {
    return;
  }

  addCooldown(botCommand.id, botCommand.cooldown);
  commandQueue.push({
    commandName,
    botCommand,
    parsedMessage,
  });
  await workQueue(connection);
}
