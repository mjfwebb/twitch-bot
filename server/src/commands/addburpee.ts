import {
  editCustomReward,
  getCustomRewards,
} from "../handlers/twitch/helix/customRewards";
import type { BotCommand } from "../types";
import { sendChatMessage } from "./helpers/sendChatMessage";

const burpeeRedeemId = "481c1a3e-0df3-4966-8b6b-6896fd713907";
const addBurpeeRedeemId = "91b0d48c-8ded-4d7d-9ef5-c4c5ea2d3417";

export const addburpee: BotCommand = {
  command: "addburpee",
  id: "addburpee",
  hidden: true,
  privileged: true,
  callback: async (connection) => {
    const customReward = getCustomRewards().find(
      (customReward) => customReward.id === burpeeRedeemId,
    );
    const amount = customReward?.title.split(" ")[0];

    if (amount) {
      const amountIncremented = +amount + 1;

      await editCustomReward(burpeeRedeemId, {
        title: customReward.title.replace(amount, String(amountIncremented)),
      });

      const burpeeAddOneReward = getCustomRewards().find(
        (customReward) => customReward.id === addBurpeeRedeemId,
      );
      if (burpeeAddOneReward) {
        await editCustomReward(addBurpeeRedeemId, {
          cost: burpeeAddOneReward.cost + 1000,
        });
      }
      sendChatMessage(connection, "It goes ever upwards");
    }
  },
};
