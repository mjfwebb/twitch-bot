import { fetchUserInformationByName } from '../../handlers/twitch/helix/fetchUserInformation';
import { getTwitchViewerBotNames } from '../../handlers/twitchinsights/twitchViewerBots';
import type { User } from '../../storage-models/user-model';
import { Users } from '../../storage-models/user-model';
import type { UserInformation } from '../../types';

// Unlike findOrCreateUserById, this function uses the data returned from the Twitch API to create a new user.
export async function findOrCreateUserByName(displayName: string): Promise<User | null> {
  if (getTwitchViewerBotNames().includes(displayName)) {
    return null;
  }

  const userInformation = await fetchUserInformationByName(displayName);
  let user = Users.findOneByDisplayName(displayName);

  if (userInformation && userInformation.id && userInformation.display_name) {
    if (!user) {
      const isoString = new Date().toISOString();
      user = {
        userId: userInformation.id,
        nick: displayName,
        displayName: userInformation.display_name,
        welcomeMessage: '',
        points: 0,
        experience: 0,
        lastSeen: '0',
        avatarUrl: userInformation.profile_image_url,
        createdAt: isoString,
        updatedAt: isoString,
      };
    } else {
      user.displayName = userInformation.display_name;
      user.avatarUrl = userInformation.profile_image_url;
    }
    Users.saveOne(user);
  }

  return user;
}

export async function getChatUser(userId: string, userNick: string, userDisplayName: string): Promise<User> {
  const userInformation = await fetchUserInformationByName(userNick);

  return findOrCreateUserById(userId, userNick, userDisplayName, userInformation);
}

export function findOrCreateUserById(
  userId: string,
  userNick: string,
  userDisplayName: string,
  userInformation: UserInformation | null = null,
): User {
  let user = Users.findOneByUserId(userId);

  // User doesn't exist yet, so make it!
  if (!user) {
    const isoString = new Date().toISOString();
    user = {
      userId,
      nick: userNick,
      displayName: userDisplayName,
      welcomeMessage: '',
      points: 0,
      experience: 0,
      lastSeen: '0',
      avatarUrl: '',
      createdAt: isoString,
      updatedAt: isoString,
    };
  }

  // If we got a response from the API with additional information, then add it
  if (userInformation && userInformation.id && userInformation.display_name) {
    user.displayName = userInformation.display_name;
    user.avatarUrl = userInformation.profile_image_url;
  }
  Users.saveOne(user);

  return user;
}
