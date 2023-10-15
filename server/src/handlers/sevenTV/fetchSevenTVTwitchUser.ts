/// https://7tv.io/v3/users/twitch/{user-id}

import fetch from "node-fetch";
import Config from "../../config";
import { logger } from "../../logger";
import { hasOwnProperty } from "../../utils/hasOwnProperty";
import type { SevenTVTwitchUser } from "./types";

export const fetchSevenTVTwitchUser =
  async (): Promise<SevenTVTwitchUser | null> => {
    if (Config.sevenTV.enabled) {
      try {
        const url = `https://7tv.io/v3/users/twitch/${Config.twitch.broadcaster_id}`;
        const response = await fetch(url, { method: "GET" });
        const data: unknown = await response.json();

        if (
          hasOwnProperty(data, "id") &&
          hasOwnProperty(data, "username") &&
          hasOwnProperty(data, "platform") &&
          hasOwnProperty(data, "linked_at") &&
          hasOwnProperty(data, "emote_set")
        ) {
          const sevenTVUser = {
            ...data,
          };

          return sevenTVUser as SevenTVTwitchUser;
        }
      } catch (error) {
        logger.error(error);
      }
    }

    return null;
  };
