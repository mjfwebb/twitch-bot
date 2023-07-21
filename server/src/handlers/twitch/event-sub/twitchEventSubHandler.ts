import { messageWithoutTags, runMessageTags } from '../../../botCommands';
import { findBotCommand } from '../../../commands/helpers/findBotCommand';
import { sendChatMessage } from '../../../commands/helpers/sendChatMessage';
import { updateStreamStartedAt } from '../../../commands/helpers/updateStreamStartedAt';
import { logger } from '../../../logger';
import { ChannelPointRedeems } from '../../../storage-models/channel-point-redeem-model';
import { setStreamStatus } from '../../../streamState';
import type { Command, ParsedCommand, TwitchWebsocketMessage } from '../../../types';
import type { EventFromSubscriptionType, EventSubResponse } from '../../../typings/twitchEvents';
import { hasOwnProperty } from '../../../utils/hasOwnProperty';
import { getConnection } from '../irc/twitchIRCWebsocket';

const fakeParsedCommand = (command: Command): ParsedCommand => ({
  commandName: '',
  botCommand: {
    command: '',
    id: '',
    description: '',
    callback: () => false,
  },
  parsedMessage: {
    command,
    parameters: null,
    source: null,
    tags: null,
  },
});

function isSubscriptionEvent(payload: unknown): payload is EventSubResponse {
  return (
    hasOwnProperty(payload, 'event') &&
    hasOwnProperty(payload, 'subscription') &&
    hasOwnProperty(payload.subscription, 'type') &&
    typeof payload.subscription.type === 'string'
  );
}

export async function twitchEventSubHandler(data: TwitchWebsocketMessage) {
  if (isSubscriptionEvent(data.payload)) {
    switch (data.payload.subscription.type) {
      case 'stream.online': {
        const event = data.payload.event as EventFromSubscriptionType<'stream.online'>;
        if (event.started_at) {
          updateStreamStartedAt(event.started_at);
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

      case 'channel.channel_points_custom_reward_redemption.update':
      case 'channel.channel_points_custom_reward_redemption.add': {
        const event = data.payload.event as EventFromSubscriptionType<'channel.channel_points_custom_reward_redemption.add'>;
        // If the event status is canceled or unknown, we don't want to run it.
        if (event.status === 'canceled' || event.status === 'unknown') {
          return;
        }

        const reward = ChannelPointRedeems.findOneById(event.reward.id);
        if (reward && reward.actions.length > 0) {
          for (const action of reward.actions) {
            // If the action is not for the current status, we don't want to run it.
            if (action.onStatus !== event.status) {
              return;
            }

            ChannelPointRedeems.increaseTimesUsed(reward);
            const message = messageWithoutTags(action.message);

            if (message) {
              const connection = getConnection();
              if (connection) {
                sendChatMessage(
                  connection,
                  message
                    .replace('%user%', event.user_name)
                    .replace('%now%', new Date().toTimeString())
                    .replace('%count%', String(reward.timesUsed + 1)),
                );
              }
            }

            if (action.command) {
              const foundCommand = findBotCommand(action.command);
              if (foundCommand) {
                const connection = getConnection();
                if (connection) {
                  const command: Command = {
                    command: action.command,
                    botCommand: action.command,
                    botCommandParams: action.commandParams.replace('%input%', event.user_input),
                  };

                  await foundCommand.callback(connection, fakeParsedCommand(command));
                }
              }
            }
            await runMessageTags(action.message);
          }
        } else {
          logger.error(`Could not find redeem for redeem with id ${event.reward.id}`);
        }
        break;
      }

      default:
        break;
    }
  }
}
