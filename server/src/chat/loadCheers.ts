import { fetchChannelCheers } from "../handlers/twitch/helix/fetchChannelCheers";
import { fetchGlobalCheers } from "../handlers/twitch/helix/fetchGlobalCheers";
import { getIO } from "../runSocketServer";

type ChatCheer = {
  name: string;
  url: string;
  color: string;
  minBits: number;
};

const channelCheersForClient: Record<string, ChatCheer> = {};
const globalCheersForClient: Record<string, ChatCheer> = {};

export const loadCheers = async () => {
  await loadGlobalCheers();
  await loadChannelCheers();

  // Change the order of this destructuring for your preferered cheer prioritisation
  getIO().emit("cheers", {
    ...globalCheersForClient,
    ...channelCheersForClient,
  });
};

export const loadGlobalCheers = async () => {
  const globalCheers = await fetchGlobalCheers();
  if (globalCheers) {
    globalCheers.forEach((globalCheer) => {
      globalCheer.tiers.forEach((tier) => {
        const name = `${globalCheer.prefix}${tier.min_bits}`;
        globalCheersForClient[name] = {
          name,
          color: tier.color,
          url: tier.images.dark.animated["4"],
          minBits: tier.min_bits,
        };
      });
    });
  }
};

export const loadChannelCheers = async () => {
  const channelCheers = await fetchChannelCheers();
  if (channelCheers) {
    channelCheers.forEach((channelCheer) => {
      channelCheer.tiers.forEach((tier) => {
        const name = `${channelCheer.prefix}${tier.min_bits}`;

        channelCheersForClient[name] = {
          name,
          color: tier.color,
          url: tier.images.dark.animated["4"],
          minBits: tier.min_bits,
        };
      });
    });
  }
};
