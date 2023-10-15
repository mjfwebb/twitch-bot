import { StatusCodes } from "http-status-codes";
import fetch from "node-fetch";
import { getCurrentAccessToken } from "../../../auth/twitch";
import Config from "../../../config";
import { TWITCH_HELIX_URL } from "../../../constants";
import { logger } from "../../../logger";

export const setStreamTags = async (tags: string[]): Promise<void> => {
  try {
    const url = `${TWITCH_HELIX_URL}channels?broadcaster_id=${Config.twitch.broadcaster_id}`;
    const accessToken = getCurrentAccessToken();

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Client-Id": Config.twitch.client_id,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tags,
      }),
    });

    if (response.status === StatusCodes.NO_CONTENT) {
      return;
    } else {
      throw new Error(
        `setStreamTags: ${response.status} - ${response.statusText}`,
      );
    }
  } catch (error) {
    logger.error(error);
  }
};
