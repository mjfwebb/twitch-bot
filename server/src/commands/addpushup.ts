import { editCustomReward, getCustomRewards } from '../handlers/twitch/helix/customRewards';
import type { BotCommand } from '../types';
import { sendChatMessage } from './helpers/sendChatMessage';

const pushupRedeemId = 'd17e63c6-208f-4275-bcd7-6a558cc5a494';
const addPushupRedeemId = '0279c574-da62-4a22-acf1-e2e97523ea10';

export const addpushup: BotCommand = {
  command: 'addpushup',
  id: 'addpushup',
  hidden: true,
  privileged: true,
  callback: async (connection) => {
    const customReward = getCustomRewards().find((customReward) => customReward.id === pushupRedeemId);
    const amount = customReward?.title.split(' ')[0];

    if (amount) {
      const amountIncremented = +amount + 1;

      await editCustomReward(pushupRedeemId, {
        title: customReward.title.replace(amount, String(amountIncremented)),
      });

      const pushupAddOneReward = getCustomRewards().find((customReward) => customReward.id === addPushupRedeemId);
      if (pushupAddOneReward) {
        await editCustomReward(addPushupRedeemId, {
          cost: pushupAddOneReward.cost + 1000,
        });
      }
      sendChatMessage(connection, 'It goes ever upwards');
    }
  },
};
