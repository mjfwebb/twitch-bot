import { getConnection } from '../bot';
import { getBotCommands } from '../botCommands';
import { sendChatMessage } from '../commands/helpers/sendChatMessage';
import { updateStreamStartedAt } from '../commands/helpers/updateStreamStartedAt';
import { REWARDS } from '../constants';
import { playSound } from '../playSound';
import { setStreamStatus } from '../streamState';
import type { ParsedCommand, TwitchWebsocketMessage } from '../types';
import type { EventFromSubscriptionType, EventSubResponse } from '../typings/twitchEvents';
import { hasOwnProperty } from '../utils/hasOwnProperty';

const emptyParsedCommand: ParsedCommand = {
  commandName: '',
  botCommand: {
    command: '',
    id: '',
    description: '',
    callback: () => false,
  },
  parsedMessage: {
    command: null,
    parameters: null,
    source: null,
    tags: null,
  },
};

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
        const event = data.payload.event as EventFromSubscriptionType<'stream.online'>;
        if (event.started_at) {
          await updateStreamStartedAt(event.started_at);
        }
        setStreamStatus('online');
        break;
      }

      case 'stream.offline': {
        setStreamStatus('offline');
        break;
      }

      case 'channel.subscription.gift': {
        const event = data.payload.event as EventFromSubscriptionType<'channel.subscription.gift'>;
        const connection = getConnection();
        if (connection) {
          sendChatMessage(connection, `Thank you for gifting a sub ${event.user_login}, you're so generous, you're like a generous god.`);
        }
        break;
      }

      case 'channel.subscribe': {
        const event = data.payload.event as EventFromSubscriptionType<'channel.subscribe'>;
        const connection = getConnection();
        if (connection) {
          if (!event.is_gift) {
            sendChatMessage(connection, `Thank you for subscribing ${event.user_name}, you sure do know a good time when you find one.`);
          }
        }
        break;
      }

      case 'channel.raid': {
        const event = data.payload.event as EventFromSubscriptionType<'channel.raid'>;
        const connection = getConnection();
        if (connection) {
          sendChatMessage(connection, `Thank you for the raid ${event.from_broadcaster_user_name}, I think you are very sexy.`);
        }
        break;
      }

      case 'channel.follow': {
        const event = data.payload.event as EventFromSubscriptionType<'channel.follow'>;
        const connection = getConnection();
        if (connection) {
          sendChatMessage(connection, `Thank you for following ${event.user_name}, I love you`);
        }
        break;
      }

      case 'channel.channel_points_custom_reward_redemption.add': {
        const event = data.payload.event as EventFromSubscriptionType<'channel.channel_points_custom_reward_redemption.add'>;
        const reward = Object.values(REWARDS).find((value) => value === event.reward.id);
        switch (reward) {
          case REWARDS.pushup:
          case REWARDS.burpee:
          case REWARDS.squat:
            await playSound('redeem');
            {
              const connection = getConnection();
              if (connection) {
                sendChatMessage(connection, "It's time to get up and down");
              }
            }
            break;
          case REWARDS.pushupAddOne:
            {
              const addPushupCommand = getBotCommands().find((command) => command.command === 'addpushup');
              const connection = getConnection();
              if (addPushupCommand && connection) {
                await playSound('redeem');
                await addPushupCommand.callback(connection, emptyParsedCommand);
              }
            }
            break;
          case REWARDS.squatAddOne:
            {
              const addSquatCommand = getBotCommands().find((command) => command.command === 'addsquat');
              const connection = getConnection();
              if (addSquatCommand && connection) {
                await playSound('redeem');
                await addSquatCommand.callback(connection, emptyParsedCommand);
              }
            }
            break;
          case REWARDS.burpeeAddOne:
            {
              const addBurpeeCommand = getBotCommands().find((command) => command.command === 'addburpee');
              const connection = getConnection();
              if (addBurpeeCommand && connection) {
                await playSound('redeem');
                await addBurpeeCommand.callback(connection, emptyParsedCommand);
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
