import type { BotCommand } from "../types";
import { getRandomNumberInRange } from "../utils/getRandomNumberInRange";
import { sendChatMessage } from "./helpers/sendChatMessage";

export const roll: BotCommand = {
  command: ["roll"],
  id: "roll",
  description:
    "roll a number between the two numbers provided. Used like !roll 1 10",
  callback: (connection, parsedCommand) => {
    const rollBetween: string[] =
      parsedCommand.parsedMessage.command?.botCommandParams?.split(" ") || [];
    if (parseInt(rollBetween[0]) && parseInt(rollBetween[1])) {
      const roll = getRandomNumberInRange(
        parseInt(rollBetween[0]),
        parseInt(rollBetween[1]),
      );
      sendChatMessage(connection, `It's ${roll}!`);
    } else {
      return false;
    }
  },
};
