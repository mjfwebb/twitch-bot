import { MINUTE_MS } from "../constants";
import { fetchRandomIssue } from "../handlers/github/fetchRandomIssue";
import type { BotCommand } from "../types";
import { sendChatMessage } from "./helpers/sendChatMessage";

export const randomissue: BotCommand = {
  command: "randomissue",
  id: "randomissue",
  cooldown: 3 * MINUTE_MS,
  description: "Returns a random GitHub issue from the TwitchBot repository",
  callback: async (connection) => {
    const randomIssue = await fetchRandomIssue();
    if (randomIssue !== null) {
      sendChatMessage(
        connection,
        `Submitted by ${randomIssue.user?.login || "unknown"}: ${
          randomIssue.title
        } - ${randomIssue.url}`,
      );
    }
  },
};
