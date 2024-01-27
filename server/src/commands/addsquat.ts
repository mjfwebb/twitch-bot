import { editCustomReward, getCustomRewards } from '../handlers/twitch/helix/customRewards';
import { logger } from '../logger';
import type { BotCommand } from '../types';
import { sendChatMessage } from './helpers/sendChatMessage';

export const addsquat: BotCommand = {
  command: 'addsquat',
  id: 'addsquat',
  hidden: true,
  privileged: true,
  callback: async (connection) => {
    const customReward = getCustomRewards().find((customReward) => customReward.title.includes('squats on camera'));
    const amount = customReward?.title.split(' ')[0];

    if (amount) {
      const amountIncremented = +amount + 1;

      await editCustomReward(customReward.id, {
        title: customReward.title.replace(amount, String(amountIncremented)),
      });

      const squatAddOneRewards = getCustomRewards().find((customReward) => customReward.title.includes('1 more squat'));
      if (squatAddOneRewards) {
        await editCustomReward(squatAddOneRewards.id, {
          cost: squatAddOneRewards.cost + 1000,
        });
        sendChatMessage(connection, 'It goes ever upwards');
      } else {
        logger.error('Could not find add squat customReward');
        sendChatMessage(connection, 'Sorry! I could not find the add squat reward');
      }
    } else {
      logger.error('Could not find do squats customReward');
      sendChatMessage(connection, 'Sorry! I could not find the do squats reward');
    }
  },
};
