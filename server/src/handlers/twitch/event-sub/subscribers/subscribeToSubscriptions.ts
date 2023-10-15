import Config from "../../../../config";
import { logger } from "../../../../logger";
import { eventSubscribe } from "./eventSubscribe";

export const subscribeToSubscriptions = async (sessionId: string) => {
  try {
    await eventSubscribe(sessionId, "channel.subscribe", {
      broadcaster_user_id: Config.twitch.broadcaster_id,
    });
  } catch (error) {
    logger.error(error);
  }
};
