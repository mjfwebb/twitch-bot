import type { connection } from "websocket";
import { fetchUserFollow } from "../handlers/twitch/helix/fetchUserFollow";
import { getDisplayName } from "../streamState";
import type { BotCommand } from "../types";
import { timeBetweenDates } from "../utils/timeBetweenDates";
import { findOrCreateUserByName } from "./helpers/findOrCreateUser";
import { hasBotCommandParams } from "./helpers/hasBotCommandParams";
import { sendChatMessage } from "./helpers/sendChatMessage";

async function sendFollowage(
  connection: connection,
  userId: string,
  displayName: string,
) {
  const followData = await fetchUserFollow(userId);
  const followedAt = followData?.data[0].followed_at;
  if (followedAt) {
    const timeString = timeBetweenDates(new Date(followedAt), new Date());
    sendChatMessage(
      connection,
      `${displayName} has been following ${getDisplayName()} for ${timeString}`,
    );
  } else {
    sendChatMessage(
      connection,
      `${displayName} is not following ${getDisplayName()}`,
    );
  }
}

export const followage: BotCommand = {
  command: "followage",
  id: "followage",
  cooldown: 0,
  callback: async (connection, parsedCommand) => {
    if (hasBotCommandParams(parsedCommand.parsedMessage)) {
      const targetName = parsedCommand.parsedMessage.command?.botCommandParams;
      if (targetName) {
        const user = await findOrCreateUserByName(targetName);
        if (user && user.userId && user.displayName) {
          await sendFollowage(connection, user.userId, user.displayName);
        } else {
          sendChatMessage(connection, "Huh?");
        }
      }
    } else {
      const userId = parsedCommand.parsedMessage.tags?.["user-id"];
      const userName = parsedCommand.parsedMessage.tags?.["display-name"];
      if (userId && userName) {
        await sendFollowage(connection, userId, userName);
      }
    }
  },
  description:
    "Shows you the followage information for yourself or the specified user",
};
