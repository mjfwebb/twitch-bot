import { getBotCommands } from '../../botCommands';

export const findBotCommand = (commandName: string) => {
  return getBotCommands().find((command) => {
    if (Array.isArray(command.command)) {
      return command.command.includes(commandName);
    } else {
      return command.command === commandName;
    }
  });
};
