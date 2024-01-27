import { editCustomReward, getCustomRewards } from '../handlers/twitch/helix/customRewards';
import { logger } from '../logger';
import type { BotCommand } from '../types';
import { sendChatMessage } from './helpers/sendChatMessage';

export const addburpee: BotCommand = {
  command: 'addburpee',
  id: 'addburpee',
  hidden: true,
  privileged: true,
  callback: async (connection) => {
    const customReward = getCustomRewards().find((customReward) => customReward.title.includes('burpees on camera'));
    const amount = customReward?.title.split(' ')[0];

    if (amount) {
      const amountIncremented = +amount + 1;

      await editCustomReward(customReward.id, {
        title: customReward.title.replace(amount, String(amountIncremented)),
      });

      const burpeeAddOneReward = getCustomRewards().find((customReward) => customReward.title.includes('1 more burpee'));
      if (burpeeAddOneReward) {
        await editCustomReward(burpeeAddOneReward.id, {
          cost: burpeeAddOneReward.cost + 1000,
        });
        sendChatMessage(connection, 'It goes ever upwards');
      } else {
        logger.error('Could not find add burpee customReward');
        sendChatMessage(connection, 'Sorry! I could not find the add burpee reward');
      }
    } else {
      logger.error('Could not find do burpees customReward');
      sendChatMessage(connection, 'Sorry! I could not find the do burpees reward');
    }
  },
};
