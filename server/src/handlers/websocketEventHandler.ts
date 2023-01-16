import { getConnection } from '../bot';
import { REWARDS } from '../constants';
import { botCommands } from '../botCommands';
import { sendChatMessage } from '../helpers/sendChatMessage';
import { updateStreamStartedAt } from '../helpers/updateStreamStartedAt';
import StreamModel from '../models/stream-model';
import { playSound } from '../playSound';
import { setStreamState } from '../streamState';
import type {
  ChannelPointRedeemNotificatonEvent,
  FollowNotificationEvent,
  RaidNotificationEvent,
  ChannelSubscriptionEvent,
  TwitchWebsocketMessage,
  EventSubResponse,
  ChannelSubscriptionGiftEvent,
  StreamOnlineNotificationEvent,
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

export async function websocketEventHandler(data: TwitchWebsocketMessage) {
  if (isSubscriptionEvent(data.payload)) {
    switch (data.payload.subscription.type) {
      case 'stream.online': {
        const event = data.payload.event as StreamOnlineNotificationEvent;
        if (event.started_at) {
          await updateStreamStartedAt(event.started_at);
        }
        setStreamState('online');
        break;
      }

      case 'stream.offline': {
        setStreamState('offline');
        break;
      }

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
            await playSound('redeem');
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
                await playSound('redeem');
                await addPushupCommand.callback(connection, {
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
              await playSound('redeem');
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
