import { Users } from "../storage-models/user-model";
import type { BotCommand } from "../types";
import { findOrCreateUserById } from "./helpers/findOrCreateUser";
import { hasBotCommandParams } from "./helpers/hasBotCommandParams";
import { sendChatMessage } from "./helpers/sendChatMessage";

export const welcome: BotCommand = {
  command: "welcome",
  id: "welcome",
  description:
    "Change your welcome message. Use %nick% to put your name in it!",
  callback: (connection, parsedCommand) => {
    if (hasBotCommandParams(parsedCommand.parsedMessage)) {
      const userId = parsedCommand.parsedMessage.tags?.["user-id"];
      const nick = parsedCommand.parsedMessage.source?.nick;
      const displayName = parsedCommand.parsedMessage.tags?.["display-name"];
      const welcomeMessage =
        parsedCommand.parsedMessage.command?.botCommandParams;
      if (
        userId &&
        nick &&
        displayName &&
        welcomeMessage &&
        !welcomeMessage.startsWith("!") &&
        !welcomeMessage.startsWith("/")
      ) {
        const user = findOrCreateUserById(userId, nick, displayName);
        user.welcomeMessage = welcomeMessage;
        Users.saveOne(user);
        sendChatMessage(connection, `Welcome message updated 🎉`);
      } else {
        sendChatMessage(
          connection,
          `There was a problem updating your welcome message 😭`,
        );
      }
    } else {
      sendChatMessage(
        connection,
        `You need to provide a welcome message! Like this: !welcome Hello %nick%!`,
      );
    }
  },
};
