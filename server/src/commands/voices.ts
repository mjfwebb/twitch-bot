import { SECOND_MS, VOICES } from "../constants";
import type { BotCommand } from "../types";
import { sendChatMessage } from "./helpers/sendChatMessage";

export const voices: BotCommand = {
  command: "voices",
  id: "voices",
  cooldown: 5 * SECOND_MS,
  description: "Gets the available tts voices",
  callback: (connection) => {
    const voicesMessage = `The available tts voices are: ${VOICES.map(
      (voice) => voice.name,
    ).join(", ")}`;
    sendChatMessage(connection, voicesMessage);
  },
};
