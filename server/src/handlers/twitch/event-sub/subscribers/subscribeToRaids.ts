import Config from "../../../../config";
import { logger } from "../../../../logger";
import { eventSubscribe } from "./eventSubscribe";

export const subscribeToRaids = async (sessionId: string) => {
  try {
    await eventSubscribe(sessionId, "channel.raid", {
      to_broadcaster_user_id: Config.twitch.broadcaster_id,
    });
  } catch (error) {
    logger.error(error);
  }
};
