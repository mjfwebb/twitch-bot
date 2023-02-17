import type { User } from '../../models/user-model';
import UserModel from '../../models/user-model';
import type { HydratedDocument } from 'mongoose';
import { fetchUserInformationByName } from '../../handlers/twitch/helix/fetchUserInformation';
import { getTwitchViewerBotNames } from '../../handlers/twitchinsights/twitchViewerBots';

export async function findOrCreateUserByName(displayName: string): Promise<HydratedDocument<User> | null> {
  if (getTwitchViewerBotNames().includes(displayName)) {
    return null;
  }

  const user = await UserModel.findOne({ displayName });
  if (user) {
    await user.save();
    return user;
  } else {
    const userInformation = await fetchUserInformationByName(displayName);
    if (userInformation?.id && userInformation?.display_name) {
      const user = new UserModel({
        userId: userInformation?.id,
        displayName: userInformation?.display_name,
      });
      await user.save();
      return user;
    }
  }
  return null;
}

export async function findOrCreateUserById(userId: string): Promise<HydratedDocument<User>> {
  const user = await UserModel.findOne({ userId });
  if (user) {
    await user.save();
    return user;
  } else {
    const user = new UserModel({
      userId,
    });
    await user.save();
    return user;
  }
}
