import type websocket from "websocket";
import { sendChatMessage } from "../../../commands/helpers/sendChatMessage";
import { runTTS } from "../../../commands/tts";
import Config from "../../../config";
import type { ParsedMessage } from "../../../types";

export async function subHandler(
  connection: websocket.connection,
  parsedMessage: ParsedMessage,
): Promise<void> {
  // If the feature is disabled, then we don't handle this event
  if (!Config.features.sub_handler) {
    return;
  }

  const msgId = parsedMessage.tags?.["msg-id"];
  const message = parsedMessage.parameters;

  switch (msgId) {
    case "sub":
    case "resub":
      {
        const months = parsedMessage.tags?.["msg-param-cumulative-months"];
        const subber = parsedMessage.tags?.["display-name"] || "unknown";

        if (months === "1") {
          sendChatMessage(
            connection,
            `Thank you for subbing ${subber}! This is the start of something beautiful! catKISS`,
          );
        } else if (months === "12") {
          sendChatMessage(
            connection,
            `Thank you ${subber} for 12 months! It's been a year! catKISS`,
          );
        } else {
          sendChatMessage(
            connection,
            `Thank you for subbing ${subber}! catKISS`,
          );
        }
        if (message) {
          await runTTS(message);
        }
      }
      break;
    case "subgift":
      {
        const sender = parsedMessage.tags?.["display-name"] || "unknown";
        const recipient =
          parsedMessage.tags?.["msg-param-recipient-display-name"] || "unknown";
        sendChatMessage(
          connection,
          `Thank you ${sender} for gifting a sub to ${recipient}! You are so generous! catKISS`,
        );
      }
      break;
    default:
      break;
  }
}
