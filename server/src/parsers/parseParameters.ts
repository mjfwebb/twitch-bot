// Parsing the IRC parameters component if it contains a command (e.g., !dice).

import type { Command } from '../types';

export function parseParameters(rawParametersComponent: string, command: Command) {
  const idx = 0;
  const commandParts: string = rawParametersComponent.slice(idx + 1).trim();
  const paramsIdx = commandParts.indexOf(' ');

  if (-1 == paramsIdx) {
    // no parameters
    command.botCommand = commandParts.slice(0);
  } else {
    command.botCommand = commandParts.slice(0, paramsIdx);
    command.botCommandParams = commandParts.slice(paramsIdx).trim();
    // TODO: remove extra spaces in parameters string
  }

  return command;
}
