import type { ParsedMessage, ParsedMessageWithCommand } from "../../types";

// Returns true if the message has a command and the command has botCommandParams
// A message with botCommandParams is a message that started with !
export function hasBotCommandParams(
  parsedMessage: ParsedMessage,
): parsedMessage is ParsedMessageWithCommand {
  return !!parsedMessage.command?.botCommandParams;
}
