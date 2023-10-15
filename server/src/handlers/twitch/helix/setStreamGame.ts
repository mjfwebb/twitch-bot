import { StatusCodes } from "http-status-codes";
import fetch from "node-fetch";
import { getCurrentAccessToken } from "../../../auth/twitch";
import Config from "../../../config";
import { TWITCH_HELIX_URL } from "../../../constants";
import { logger } from "../../../logger";

export const setStreamGame = async (gameId: string): Promise<void> => {
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
        game_id: gameId,
      }),
    });

    if (response.status === StatusCodes.NO_CONTENT) {
      return;
    } else {
      throw new Error(
        `setStreamGame: ${response.status} - ${response.statusText}`,
      );
    }
  } catch (error) {
    logger.error(error);
  }
};
