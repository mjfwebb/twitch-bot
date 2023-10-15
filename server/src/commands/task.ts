import { SECOND_MS } from "../constants";
import { Tasks } from "../storage-models/task-model";
import type { BotCommand } from "../types";
import { sendChatMessage } from "./helpers/sendChatMessage";

export const task: BotCommand = {
  command: "task",
  id: "task",
  description: "Gets the current task",
  cooldown: 5 * SECOND_MS,
  callback: (connection) => {
    const task = Tasks.data[Tasks.data.length - 1];
    if (task) {
      sendChatMessage(
        connection,
        `Current task: ${task.content.command.botCommandParams}`,
      );
    } else {
      sendChatMessage(connection, "No current task!");
    }
  },
};
