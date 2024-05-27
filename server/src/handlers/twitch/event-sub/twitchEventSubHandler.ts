import { messageWithoutTags, runMessageTags } from '../../../botCommands';
import { findBotCommand } from '../../../commands/helpers/findBotCommand';
import { sendChatMessage } from '../../../commands/helpers/sendChatMessage';
import { updateStreamStartedAt } from '../../../commands/helpers/updateStreamStartedAt';
import { logger } from '../../../logger';
import { ChannelPointRedeems } from '../../../storage-models/channel-point-redeem-model';
import { StreamState } from '../../../streamState';
import type { Command } from '../../../types';
import type { EventsubEvent } from '../../../typings/twitchEvents';
import { fakeParsedCommand } from '../../../utils/fakeParsedCommand';
import { discordLiveNotificationWebhook } from '../../discord/discord';
import { getConnection } from '../irc/twitchIRCWebsocket';

export async function twitchEventSubHandler(data: EventsubEvent) {
  switch (data.eventType) {
    case 'stream.online': {
      if (data.started_at) {
        updateStreamStartedAt(data.started_at);
      }
      StreamState.status = 'online';
      discordLiveNotificationWebhook(StreamState.title, `https://twitch.tv/${data.broadcaster_user_login}`);
      break;
    }

    case 'stream.offline': {
      StreamState.status = 'offline';
      break;
    }

    case 'channel.subscription.gift': {
      const connection = getConnection();
      if (connection) {
        sendChatMessage(connection, `Thank you for gifting a sub ${data.user_login}, you're so generous, you're a generous god.`);
      }
      break;
    }

    case 'channel.subscribe': {
      const connection = getConnection();
      if (connection) {
        if (!data.is_gift) {
          sendChatMessage(connection, `Thank you for subscribing ${data.user_name}, you sure do know a good time when you find one.`);
        }
      }
      break;
    }

    case 'channel.raid': {
      const connection = getConnection();
      if (connection) {
        sendChatMessage(connection, `Thank you for the raid ${data.from_broadcaster_user_name}, I think you are very sexy.`);
      }
      break;
    }

    case 'channel.follow': {
      const connection = getConnection();
      if (connection) {
        sendChatMessage(connection, `Thank you for following ${data.user_name}, I love you`);
      }
      break;
    }

    case 'channel.channel_points_custom_reward_redemption.update':
    case 'channel.channel_points_custom_reward_redemption.add': {
      // If the event status is cancelled or unknown, we don't want to run it.
      if (data.status === 'canceled' || data.status === 'unknown') {
        return;
      }

      const reward = ChannelPointRedeems.findOneById(data.reward.id);
      if (reward && reward.actions.length > 0) {
        for (const action of reward.actions) {
          // If the action is not for the current status, we don't want to run it.
          if (action.onStatus !== data.status) {
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
                  .replace('%user%', data.user_name)
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
                  botCommandParams: action.commandParams
                    .replace('%input%', data.user_input)
                    .replace('%user%', data.user_name)
                    .replace('%now%', new Date().toTimeString())
                    .replace('%count%', String(reward.timesUsed + 1)),
                };

                await foundCommand.callback(connection, fakeParsedCommand(command));
              }
            }
          }
          await runMessageTags(action.message);
        }
      } else {
        logger.error(`Could not find redeem for redeem with id ${data.reward.id}`);
      }
      break;
    }
    default:
      break;
  }
}
