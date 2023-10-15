import { createIssue } from "../handlers/github/createIssue";
import type { BotCommand } from "../types";
import { hasBotCommandParams } from "./helpers/hasBotCommandParams";
import { sendChatMessage } from "./helpers/sendChatMessage";

export const addissue: BotCommand = {
  command: "addissue",
  id: "addissue",
  privileged: true,
  hidden: true,
  callback: async (connection, parsedCommand) => {
    if (hasBotCommandParams(parsedCommand.parsedMessage)) {
      const newIssue = parsedCommand.parsedMessage.command?.botCommandParams;
      if (newIssue) {
        const newIssueParts = newIssue
          .split('"')
          .filter((x) => x.trim().length > 0);
        if (newIssueParts.length !== 2) {
          return sendChatMessage(
            connection,
            `Something went wrong. The command should be used like !addissue "title" "description"`,
          );
        }

        const newIssueTitle = newIssueParts[0];
        const newIssueDescription = newIssueParts[1];
        const createdIssue = await createIssue(
          newIssueTitle,
          newIssueDescription,
        );
        if (createdIssue) {
          sendChatMessage(
            connection,
            `Issue ${createdIssue.number} with the title "${createdIssue.title}" has been created: ${createdIssue.html_url}`,
          );
        }
      }
    }
  },
};
