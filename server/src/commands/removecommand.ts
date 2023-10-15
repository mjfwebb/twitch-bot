import { loadBotCommands } from "../botCommands";
import { Commands } from "../storage-models/command-model";
import type { BotCommand } from "../types";
import { hasBotCommandParams } from "./helpers/hasBotCommandParams";
import { sendChatMessage } from "./helpers/sendChatMessage";

export const removecommand: BotCommand = {
  command: "removecommand",
  id: "removecommand",
  privileged: true,
  hidden: true,
  description: "",
  callback: (connection, parsedCommand) => {
    if (hasBotCommandParams(parsedCommand.parsedMessage)) {
      const commandId = parsedCommand.parsedMessage.command?.botCommandParams;
      if (commandId) {
        const newCommandParts = commandId.split(" ");
        if (newCommandParts.length > 1) {
          return sendChatMessage(connection, "Huh?");
        }
        const command = Commands.findOneByCommandId(commandId);
        if (command) {
          Commands.deleteOne(command);
          loadBotCommands();
          sendChatMessage(
            connection,
            `The command ${commandId} has been removed!`,
          );
        }
      }
    }
  },
};
