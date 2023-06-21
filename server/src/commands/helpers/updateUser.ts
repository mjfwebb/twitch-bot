import type { HydratedDocument } from 'mongoose';
import Config from '../../config';
import { fetchUserInformationById, fetchUserInformationByName } from '../../handlers/twitch/helix/fetchUserInformation';
import { getTwitchViewerBotNames } from '../../handlers/twitchinsights/twitchViewerBots';
import type { User } from '../../models/user-model';
import UserModel from '../../models/user-model';

export async function updateUserByName(displayName: string): Promise<HydratedDocument<User> | null> {
  if (!Config.mongoDB.enabled) {
    return null;
  }

  if (getTwitchViewerBotNames().includes(displayName)) {
    return null;
  }

  const user = await UserModel.findOne({ displayName });
  if (!user) {
    return null;
  } else {
    const userInformation = await fetchUserInformationByName(displayName);
    if (userInformation && userInformation.id && userInformation.display_name && userInformation.profile_image_url) {
      user.avatarUrl = userInformation.profile_image_url;
      await user.save();
      return user;
    }
  }
  return null;
}

export async function updateUserById(userId: string): Promise<HydratedDocument<User> | null> {
  if (getTwitchViewerBotNames().includes(userId)) {
    return null;
  }

  const user = await UserModel.findOne({ userId });
  if (!user) {
    return null;
  } else {
    const userInformation = await fetchUserInformationById(userId);
    if (userInformation && userInformation.id && userInformation.display_name && userInformation.profile_image_url) {
      user.displayName = userInformation.display_name;
      user.avatarUrl = userInformation.profile_image_url;
      await user.save();
      return user;
    }
  }
  return null;
}
