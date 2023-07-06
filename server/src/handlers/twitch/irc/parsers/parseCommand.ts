import type { Command } from '../../../../types';

// Parses the command component of the IRC message.
export function parseCommand(rawCommandComponent: string): Command | null {
  let parsedCommand: Command | null = null;
  const commandParts = rawCommandComponent.split(' ');

  switch (commandParts[0]) {
    case 'JOIN':
    case 'PART':
    case 'NOTICE':
    case 'CLEARCHAT':
    case 'HOSTTARGET':
    case 'PRIVMSG':
    case 'USERNOTICE':
    case 'USERSTATE': // Make sure you request the /commands capability.
    case 'ROOMSTATE': // Make sure you request the /tags capability.
      parsedCommand = {
        command: commandParts[0],
        channel: commandParts[1],
      };
      break;
    case 'PING':
      parsedCommand = {
        command: commandParts[0],
      };
      break;
    case 'CAP':
      parsedCommand = {
        command: commandParts[0],
        isCapRequestEnabled: commandParts[2] === 'ACK' ? true : false,
        // The parameters part of the messages contains the
        // enabled capabilities.
      };
      break;
    case 'GLOBALUSERSTATE': // Included only if you request the /commands capability.
      // But it has no meaning without also including the /tags capability.
      parsedCommand = {
        command: commandParts[0],
      };
      break;
    case 'RECONNECT':
      console.log('The Twitch IRC server is about to terminate the connection for maintenance.');
      parsedCommand = {
        command: commandParts[0],
      };
      break;
    case '421': // Unknown command.
      console.log(`Unsupported IRC command: ${commandParts[2]}`);
      return null;
    case '001': // Logged in (successfully authenticated).
      parsedCommand = {
        command: commandParts[0],
        channel: commandParts[1],
      };
      break;
    case '002': // Ignoring all other numeric messages.
    case '003':
    case '004':
    case '353': // Tells you who else is in the chat room you're joining.
    case '366':
    case '372':
    case '375':
    case '376':
      return null;
    default:
      console.log(`\nUnexpected command: ${commandParts[0]}\n`);
      return null;
  }

  return parsedCommand;
}
