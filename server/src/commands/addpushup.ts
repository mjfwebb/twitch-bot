import { editCustomReward, getCustomRewards } from '../handlers/twitch/helix/customRewards';
import { logger } from '../logger';
import type { BotCommand } from '../types';
import { sendChatMessage } from './helpers/sendChatMessage';

export const addpushup: BotCommand = {
  command: 'addpushup',
  id: 'addpushup',
  hidden: true,
  privileged: true,
  callback: async (connection) => {
    const customReward = getCustomRewards().find((customReward) => customReward.title.includes('pushups on camera'));
    const amount = customReward?.title.split(' ')[0];

    if (amount) {
      const amountIncremented = +amount + 1;

      await editCustomReward(customReward.id, {
        title: customReward.title.replace(amount, String(amountIncremented)),
      });

      const pushupAddOneReward = getCustomRewards().find((customReward) => customReward.title.includes('1 more pushup'));
      if (pushupAddOneReward) {
        await editCustomReward(pushupAddOneReward.id, {
          cost: pushupAddOneReward.cost + 1000,
        });
        sendChatMessage(connection, 'It goes ever upwards');
      } else {
        logger.error('Could not find add pushup customReward');
        sendChatMessage(connection, 'Sorry! I could not find the add pushup reward');
      }
    } else {
      logger.error('Could not find do pushups customReward');
      sendChatMessage(connection, 'Sorry! I could not find the do pushups reward');
    }
  },
};
