import type { HydratedDocument } from 'mongoose';
import Config from '../../config';
import { fetchUserInformationByName } from '../../handlers/twitch/helix/fetchUserInformation';
import { getTwitchViewerBotNames } from '../../handlers/twitchinsights/twitchViewerBots';
import type { User } from '../../models/user-model';
import UserModel from '../../models/user-model';
import type { UserInformation } from '../../types';

function nonDBUser(userInformation: UserInformation | null): User {
  return {
    nick: userInformation?.display_name || 'unknown',
    points: 0,
    experience: 0,
    userId: userInformation?.id || 'unknown',
    displayName: userInformation?.display_name || 'unknown',
    avatarUrl: userInformation?.profile_image_url || '',
    lastSeen: '0',
  };
}

export async function findOrCreateUserByName(displayName: string): Promise<User | null> {
  if (getTwitchViewerBotNames().includes(displayName)) {
    return null;
  }

  const userInformation = await fetchUserInformationByName(displayName);

  // If there is no database then just return the collected data, if possible
  if (!Config.mongoDB) {
    return nonDBUser(userInformation);
  }

  let user = await UserModel.findOne({ displayName });

  if (userInformation && userInformation.id && userInformation.display_name) {
    if (!user) {
      user = new UserModel({
        userId: userInformation.id,
        displayName: userInformation.display_name,
        avatarUrl: userInformation.profile_image_url,
      });
      await user.save();
    } else {
      user.displayName = userInformation.display_name;
      user.avatarUrl = userInformation.profile_image_url;
      await user.save();
    }
  }

  return user;
}

export async function getChatUser(userId: string, nick: string) {
  const userInformation = await fetchUserInformationByName(nick);

  // If there is no database then just return the collected data, if possible
  if (!Config.mongoDB) {
    return nonDBUser(userInformation);
  }

  return await findOrCreateUserById(userId, nick, userInformation);
}

export async function findOrCreateUserById(
  userId: string,
  nick: string,
  userInformation: UserInformation | null = null,
): Promise<HydratedDocument<User>> {
  let user = await UserModel.findOne({ userId });

  // User doesn't exist yet, so make it!
  if (!user) {
    user = new UserModel({
      userId,
      nick,
    });
    await user.save();
  } else {
    // Always set nick. A user can be made through display names, at which point the nick is unknown
    user.nick = nick;
  }

  // If we got a response from the API with additional information, then add it
  if (userInformation && userInformation.id && userInformation.display_name) {
    user.displayName = userInformation.display_name;
    user.avatarUrl = userInformation.profile_image_url;
    await user.save();
  }

  return user;
}
