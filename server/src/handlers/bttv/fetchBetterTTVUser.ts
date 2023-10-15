/// https://api.betterttv.net/3/cached/users/{provider}/{providerId}

import fetch from "node-fetch";
import Config from "../../config";
import { logger } from "../../logger";
import { hasOwnProperty } from "../../utils/hasOwnProperty";
import type { BttvUser } from "./types";

export const fetchBetterTTVUser = async (): Promise<BttvUser | null> => {
  if (Config.betterTTV.enabled) {
    try {
      const url = `https://api.betterttv.net/3/cached/users/twitch/${Config.twitch.broadcaster_id}`;
      const response = await fetch(url, { method: "GET" });
      const data: unknown = await response.json();
      if (
        hasOwnProperty(data, "id") &&
        hasOwnProperty(data, "bots") &&
        hasOwnProperty(data, "avatar") &&
        hasOwnProperty(data, "channelEmotes") &&
        hasOwnProperty(data, "sharedEmotes")
      ) {
        return data as BttvUser;
      }
    } catch (error) {
      logger.error(error);
    }
  }

  return null;
};
