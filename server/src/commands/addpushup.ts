import { REWARDS } from '../constants';
import { editCustomReward, getCustomRewards } from '../handlers/customRewards';
import type { BotCommand } from '../types';
import { sendChatMessage } from './helpers/sendChatMessage';

export const addpushup: BotCommand = {
  command: 'addpushup',
  id: 'addpushup',
  hidden: true,
  priviliged: true,
  callback: async (connection) => {
    const customReward = getCustomRewards().find((customReward) => customReward.id === REWARDS.pushup);
    const amount = customReward?.title.split(' ')[0];

    if (amount) {
      const amountIncremented = +amount + 1;

      await editCustomReward(REWARDS.pushup, {
        title: customReward.title.replace(amount, String(amountIncremented)),
      });

      const pushupAddOneReward = getCustomRewards().find((customReward) => customReward.id === REWARDS.pushupAddOne);
      if (pushupAddOneReward) {
        await editCustomReward(REWARDS.pushupAddOne, {
          cost: pushupAddOneReward.cost + 1000,
        });
      }
      sendChatMessage(connection, 'It goes ever upwards');
    }
  },
};
