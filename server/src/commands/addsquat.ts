import { REWARDS } from '../constants';
import { editCustomReward, getCustomRewards } from '../handlers/twitch/helix/customRewards';
import type { BotCommand } from '../types';
import { sendChatMessage } from './helpers/sendChatMessage';

export const addsquat: BotCommand = {
  command: 'addsquat',
  id: 'addsquat',
  hidden: true,
  privileged: true,
  callback: async (connection) => {
    const customReward = getCustomRewards().find((customReward) => customReward.id === REWARDS.squat);
    const amount = customReward?.title.split(' ')[0];

    if (amount) {
      const amountIncremented = +amount + 1;

      await editCustomReward(REWARDS.squat, {
        title: customReward.title.replace(amount, String(amountIncremented)),
      });

      const squatAddOneRewards = getCustomRewards().find((customReward) => customReward.id === REWARDS.squatAddOne);
      if (squatAddOneRewards) {
        await editCustomReward(REWARDS.squatAddOne, {
          cost: squatAddOneRewards.cost + 1000,
        });
      }
      sendChatMessage(connection, 'It goes ever upwards');
    }
  },
};
