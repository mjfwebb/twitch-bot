import { getConnection } from '../bot';
import { REWARDS } from '../constants';
import { botCommands } from '../handlers/botCommands';
import { sendChatMessage } from '../helpers/sendChatMessage';
import { playSound } from '../playSound';
import type {
  ChannelPointRedeemNotificatonEvent,
  FollowNotificationEvent,
  RaidNotificationEvent,
  ChannelSubscriptionEvent,
  TwitchWebsocketMessage,
  EventSubResponse,
  ChannelSubscriptionGiftEvent,
} from '../types';
import { hasOwnProperty } from '../utils/hasOwnProperty';

function isSubscriptionEvent(payload: unknown): payload is EventSubResponse {
  return (
    hasOwnProperty(payload, 'event') &&
    hasOwnProperty(payload, 'subscription') &&
    hasOwnProperty(payload.subscription, 'type') &&
    typeof payload.subscription.type === 'string'
  );
}

export function websocketEventHandler(data: TwitchWebsocketMessage) {
  if (isSubscriptionEvent(data.payload)) {
    switch (data.payload.subscription.type) {
      case 'channel.subscription.gift': {
        const event = data.payload.event as ChannelSubscriptionGiftEvent;
        const connection = getConnection();
        if (connection) {
          sendChatMessage(connection, `Thank you for gifting a sub ${event.user_login}, you're so generous, you're like a generous god.`);
        }
        break;
      }

      case 'channel.subscribe': {
        const event = data.payload.event as ChannelSubscriptionEvent;
        const connection = getConnection();
        if (connection) {
          if (!event.is_gift) {
            sendChatMessage(connection, `Thank you for subscribing ${event.user_name}, .`);
          }
        }
        break;
      }

      case 'channel.raid': {
        const event = data.payload.event as RaidNotificationEvent;
        const connection = getConnection();
        if (connection) {
          sendChatMessage(connection, `Thank you for the raid ${event.from_broadcaster_user_name}, I think you are very sexy.`);
        }
        break;
      }

      case 'channel.follow': {
        const event = data.payload.event as FollowNotificationEvent;
        const connection = getConnection();
        if (connection) {
          sendChatMessage(connection, `Thank you for following ${event.user_name}, I love you`);
        }
        break;
      }

      case 'channel.channel_points_custom_reward_redemption.add': {
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
