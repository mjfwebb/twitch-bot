// Parses an IRC message and returns a JSON object with the message's
// component parts (tags, source (nick and host), command, parameters).
// Expects the caller to pass a single message. (Remember, the Twitch
// IRC server may send one or more IRC messages in a single message.)
// Parses an IRC message and returns a JSON object with the message's
// component parts (tags, source (nick and host), command, parameters).
// Expects the caller to pass a single message. (Remember, the Twitch
// IRC server may send one or more IRC messages in a single message.)

import type { ParsedMessage } from '../../../../types';
import { parseCommand } from './parseCommand';
import { parseParameters } from './parseParameters';
import { parseSource } from './parseSource';
import { parseTags } from './parseTags';

export function parseMessage(message: string) {
  const parsedMessage: ParsedMessage = {
    // Contains the component parts.
    tags: null,
    source: null,
    command: null,
    parameters: null,
  };

  // The start index. Increments as we parse the IRC message.
  let index = 0;

  // The raw components of the IRC message.
  let rawTagsComponent: string | null = null;
  let rawSourceComponent: string | null = null;
  let rawCommandComponent: string | null = null;
  let rawParametersComponent: string | null = null;

  // If the message includes tags, get the tags component of the IRC message.
  if (message[index] === '@') {
    // The message includes tags.
    const endIndex = message.indexOf(' ');
    rawTagsComponent = message.slice(1, endIndex);
    index = endIndex + 1; // Should now point to source colon (:).
  }

  // Get the source component (nick and host) of the IRC message.
  // The index should point to the source part; otherwise, it's a PING command.
  if (message[index] === ':') {
    index += 1;
    const endIndex = message.indexOf(' ', index);
    rawSourceComponent = message.slice(index, endIndex);
    index = endIndex + 1; // Should point to the command part of the message.
  }

  // Get the command component of the IRC message.
  let endIndex = message.indexOf(':', index); // Looking for the parameters part of the message.
  if (endIndex === -1) {
    // But not all messages include the parameters part.
    endIndex = message.length;
  }

  rawCommandComponent = message.slice(index, endIndex).trim();

  // Get the parameters component of the IRC message.
  if (endIndex != message.length) {
    // Check if the IRC message contains a parameters component.
    index = endIndex + 1; // Should point to the parameters part of the message.
    rawParametersComponent = message.slice(index);
  }

  // Parse the command component of the IRC message.
  parsedMessage.command = parseCommand(rawCommandComponent);

  // Only parse the rest of the components if it's a command
  // we care about; we ignore some messages.
  if (parsedMessage.command === null) {
    // Is null if it's a message we don't care about.
    return null;
  } else {
    if (rawTagsComponent !== null) {
      // The IRC message contains tags.
      parsedMessage.tags = parseTags(rawTagsComponent);
    }

    parsedMessage.source = parseSource(rawSourceComponent);

    parsedMessage.parameters = rawParametersComponent;
    if (rawParametersComponent && rawParametersComponent[0] === '!') {
      // The user entered a bot command in the chat window.
      parsedMessage.command = parseParameters(rawParametersComponent, parsedMessage.command);
    }

    if (rawParametersComponent && rawParametersComponent[0] === '\x01') {
      // This is an ACTION message.
      parsedMessage.command.botCommand = 'ACTION';
      parsedMessage.command.botCommandParams = rawParametersComponent.slice(7, -1).trim();
    }
  }

  return parsedMessage;
}
