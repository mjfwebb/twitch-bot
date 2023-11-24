export function stripLeadingExclamationMark(command: string): string {
  if (command.startsWith('!')) {
    return command.substring(1);
  }
  return command;
}
