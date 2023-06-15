import { fetchChannelBadges } from './handlers/twitch/helix/fetchChannelBadges';
import { fetchGlobalBadges } from './handlers/twitch/helix/fetchGlobalBadges';
import { getIO } from './runSocketServer';

type ChatBadge = {
  name: string;
  url: string;
};

const channelBadgesForClient: Record<string, ChatBadge> = {};
const globalBadgesForClient: Record<string, ChatBadge> = {};

export const loadBadges = async () => {
  await loadGlobalBadges();
  await loadChannelBadges();

  // Change the order of this destructuring for your preferered badge prioritisation
  getIO().emit('badges', { ...globalBadgesForClient, ...channelBadgesForClient });
};

export const loadGlobalBadges = async () => {
  const globalBadges = await fetchGlobalBadges();
  if (globalBadges) {
    globalBadges.forEach((globalBadge) => {
      globalBadge.versions.forEach((version) => {
        const name = `${globalBadge.set_id}_${version.id}`;

        globalBadgesForClient[name] = {
          name,
          url: version.image_url_4x,
        };
      });
    });
  }
};

export const loadChannelBadges = async () => {
  const channelBadges = await fetchChannelBadges();
  if (channelBadges) {
    channelBadges.forEach((channelBadge) => {
      channelBadge.versions.forEach((version) => {
        const name = `${channelBadge.set_id}_${version.id}`;

        channelBadgesForClient[name] = {
          name,
          url: version.image_url_4x,
        };
      });
    });
  }
};
