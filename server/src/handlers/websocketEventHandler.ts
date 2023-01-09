import { getConnection } from '../bot';
import { REWARDS } from '../constants';
import { botCommands } from '../handlers/botCommands';
import { sendChatMessage } from '../helpers/sendChatMessage';
import { playSound } from '../playSound';
import type { ChannelPointRedeemNotificatonEvent, FollowNotificationEvent, TwitchWebsocketMessage } from '../types';
import { hasOwnProperty } from '../utils/hasOwnProperty';

export function websocketEventHandler(data: TwitchWebsocketMessage) {
  if (
    hasOwnProperty(data.payload, 'event') &&
    hasOwnProperty(data.payload, 'subscription') &&
    hasOwnProperty(data.payload.subscription, 'type') &&
    typeof data.payload.subscription.type === 'string'
  ) {
    switch (data.payload.subscription.type) {
      case 'channel.raid':
        break;

      case 'channel.follow': {
        // FollowNotificationEvent
        const event = data.payload.event as FollowNotificationEvent;
        const connection = getConnection();
        if (connection) {
          sendChatMessage(connection, `Thank you for following ${event.user_name}, I love you`);
        }
        break;
      }

      case 'channel.channel_points_custom_reward_redemption.add': {
        // ChannelPointRedeemNotificatonEvent
        const event = data.payload.event as ChannelPointRedeemNotificatonEvent;
        const reward = Object.values(REWARDS).find((value) => value === event.reward.id);
        switch (reward) {
          case REWARDS.pushup:
            playSound('redeem');
            {
              const connection = getConnection();
              if (connection) {
                sendChatMessage(connection, "It's time to get down");
              }
            }
            break;
          case REWARDS.pushupAddOne:
            {
              const addPushupCommand = botCommands.find((command) => command.command === 'addpushup');
              const connection = getConnection();
              if (addPushupCommand && connection) {
                playSound('redeem');
                addPushupCommand.callback(connection, {
                  tags: null,
                  source: null,
                  command: null,
                  parameters: null,
                });
              }
            }
            break;
          case REWARDS.test:
            {
              playSound('redeem');
            }
            break;
          default:
            console.log('Unsupported reward');
            break;
        }
        break;
      }

      default:
        break;
    }
  }
}
