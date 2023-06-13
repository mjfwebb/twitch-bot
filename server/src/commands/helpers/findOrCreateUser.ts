import type { HydratedDocument } from 'mongoose';
import { fetchUserInformationByName } from '../../handlers/twitch/helix/fetchUserInformation';
import { getTwitchViewerBotNames } from '../../handlers/twitchinsights/twitchViewerBots';
import type { User } from '../../models/user-model';
import UserModel from '../../models/user-model';

export async function findOrCreateUserByName(displayName: string): Promise<HydratedDocument<User> | null> {
  if (getTwitchViewerBotNames().includes(displayName)) {
    return null;
  }

  let user = await UserModel.findOne({ displayName });
  const userInformation = await fetchUserInformationByName(displayName);

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

export async function findOrCreateUserById(userId: string, nick: string): Promise<HydratedDocument<User>> {
  let user = await UserModel.findOne({ userId });
  const userInformation = await fetchUserInformationByName(nick);

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
