import open from "open";
import type { BotCommand } from "../types";

export const issue: BotCommand = {
  command: "issue",
  id: "issue",
  mustBeUser: ["athano"],
  privileged: true,
  hidden: true,
  callback: async () => {
    await open("https://github.com/mjfwebb/twitch-bot/issues/new");
  },
};
