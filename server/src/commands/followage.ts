import { fetchUserFollow } from '../handlers/twitch/helix/fetchUserFollow';
import type { BotCommand } from '../types';
import { sendChatMessage } from './helpers/sendChatMessage';
import { timeBetweenDates } from '../utils/timeBetweenDates';
import { hasBotCommandParams } from './helpers/hasBotCommandParams';
import type { connection } from 'websocket';
import { findOrCreateUserByName } from './helpers/findOrCreateUser';
import { getDisplayName } from '../streamState';

async function sendFollowage(connection: connection, userId: string, displayName: string) {
  const followData = await fetchUserFollow(userId);
  const followedAt = followData?.data[0].followed_at;
  if (followedAt) {
    const timeString = timeBetweenDates(new Date(followedAt), new Date());
    sendChatMessage(connection, `${displayName} has been following ${getDisplayName()} for ${timeString}`);
  } else {
    sendChatMessage(connection, `${displayName} is not following ${getDisplayName()}`);
  }
}

export const followage: BotCommand = {
  command: 'followage',
  id: 'followage',
  cooldown: 0,
  callback: async (connection, parsedMessage) => {
    if (hasBotCommandParams(parsedMessage)) {
      const targetName = parsedMessage.command?.botCommandParams;
      if (targetName) {
        const user = await findOrCreateUserByName(targetName);
        if (user && user.userId && user.displayName) {
          await sendFollowage(connection, user.userId, user.displayName);
        } else {
          sendChatMessage(connection, 'Huh?');
        }
      }
    } else {
      const userId = parsedMessage.tags?.['user-id'];
      const userName = parsedMessage.tags?.['display-name'];
      if (userId && userName) {
        await sendFollowage(connection, userId, userName);
      }
    }
  },
  description: '',
};
