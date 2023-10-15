import type { Command, ParsedCommand } from "../types";

export const fakeParsedCommand = (command: Command): ParsedCommand => ({
  commandName: "",
  botCommand: {
    command: "",
    id: "",
    description: "",
    callback: () => false,
  },
  parsedMessage: {
    command,
    parameters: null,
    source: null,
    tags: null,
  },
});
