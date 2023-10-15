/// https://7tv.io/v3/emotes/{emote-id}

import fetch from "node-fetch";
import { logger } from "../../logger";
import { hasOwnProperty } from "../../utils/hasOwnProperty";
import type { SevenTVEmoteData } from "./types";

export const fetchSevenTVEmote = async (
  emoteId: string,
): Promise<SevenTVEmoteData | null> => {
  try {
    const url = `https://7tv.io/v3/emotes/${emoteId}`;
    const response = await fetch(url, { method: "GET" });
    const data: unknown = await response.json();

    if (
      hasOwnProperty(data, "id") &&
      hasOwnProperty(data, "name") &&
      hasOwnProperty(data, "flags") &&
      hasOwnProperty(data, "host")
    ) {
      return data as SevenTVEmoteData;
    }
  } catch (error) {
    logger.error(error);
  }
  return null;
};
