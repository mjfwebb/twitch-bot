import { REWARDS } from '../constants';
import { editCustomReward, getCustomRewards } from '../handlers/twitch/helix/customRewards';
import type { BotCommand } from '../types';
import { sendChatMessage } from './helpers/sendChatMessage';

export const addburpee: BotCommand = {
  command: 'addburpee',
  id: 'addburpee',
  hidden: true,
  priviliged: true,
  callback: async (connection) => {
    const customReward = getCustomRewards().find((customReward) => customReward.id === REWARDS.burpee);
    const amount = customReward?.title.split(' ')[0];

    if (amount) {
      const amountIncremented = +amount + 1;

      await editCustomReward(REWARDS.burpee, {
        title: customReward.title.replace(amount, String(amountIncremented)),
      });

      const burpeeAddOneReward = getCustomRewards().find((customReward) => customReward.id === REWARDS.burpeeAddOne);
      if (burpeeAddOneReward) {
        await editCustomReward(REWARDS.burpeeAddOne, {
          cost: burpeeAddOneReward.cost + 1000,
        });
      }
      sendChatMessage(connection, 'It goes ever upwards');
    }
  },
};
