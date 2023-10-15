import { getBotCommands } from "../botCommands";
import type { BotCommand } from "../types";
import { sendChatMessage } from "./helpers/sendChatMessage";

export const commands: BotCommand = {
  command: "commands",
  id: "commands",
  description: "It's the commands command to see the commands",
  hidden: true,
  callback: (connection) => {
    const botCommands = getBotCommands()
      .filter((bc) => {
        if (bc.mustBeUser) {
          return false;
        }
        if (bc.hidden) {
          return false;
        }
        if (bc.privileged) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (a.id < b.id) {
          return -1;
        } else if (a.id > b.id) {
          return 1;
        }
        return 0;
      })
      .map((bc) => bc.id);
    sendChatMessage(
      connection,
      `Available commands are: ${[...new Set(botCommands)].join(", ")}`,
    );
  },
  cooldown: 5000,
};
