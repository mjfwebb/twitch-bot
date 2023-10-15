import {
  editCustomReward,
  getCustomRewards,
} from "../handlers/twitch/helix/customRewards";
import type { BotCommand } from "../types";
import { sendChatMessage } from "./helpers/sendChatMessage";

const squatRedeemId = "481c1a3e-0df3-4966-8b6b-6896fd713907";
const addBurpeeRedeemId = "91b0d48c-8ded-4d7d-9ef5-c4c5ea2d3417";

export const addsquat: BotCommand = {
  command: "addsquat",
  id: "addsquat",
  hidden: true,
  privileged: true,
  callback: async (connection) => {
    const customReward = getCustomRewards().find(
      (customReward) => customReward.id === squatRedeemId,
    );
    const amount = customReward?.title.split(" ")[0];

    if (amount) {
      const amountIncremented = +amount + 1;

      await editCustomReward(squatRedeemId, {
        title: customReward.title.replace(amount, String(amountIncremented)),
      });

      const squatAddOneRewards = getCustomRewards().find(
        (customReward) => customReward.id === addBurpeeRedeemId,
      );
      if (squatAddOneRewards) {
        await editCustomReward(addBurpeeRedeemId, {
          cost: squatAddOneRewards.cost + 1000,
        });
      }
      sendChatMessage(connection, "It goes ever upwards");
    }
  },
};
