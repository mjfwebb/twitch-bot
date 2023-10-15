import { SECOND_MS } from "../constants";
import { getPlaybackQueue } from "../handlers/spotify/getPlaybackQueue";
import type { BotCommand } from "../types";
import { sendChatMessage } from "./helpers/sendChatMessage";
import { songDetails } from "./helpers/songDetail";

export const songqueue: BotCommand = {
  command: ["songqueue", "sq"],
  id: "songqueue",
  cooldown: 10 * SECOND_MS,
  privileged: false,
  description: "Shows the next songs in the playback queue (from Spotify)",
  callback: async (connection) => {
    const queue = await getPlaybackQueue();
    if (queue) {
      const nextInQueue = queue.splice(0, 3);
      sendChatMessage(
        connection,
        `Next ${nextInQueue.length} queued songs: ${nextInQueue
          .map((queueItem, index) => `${index + 1}) ${songDetails(queueItem)}`)
          .join(", ")}`,
      );
    } else {
      sendChatMessage(connection, `No Spotify connection found`);
    }
  },
};
