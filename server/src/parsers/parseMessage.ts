// Parses an IRC message and returns a JSON object with the message's
// component parts (tags, source (nick and host), command, parameters).
// Expects the caller to pass a single message. (Remember, the Twitch
// IRC server may send one or more IRC messages in a single message.)
// Parses an IRC message and returns a JSON object with the message's
// component parts (tags, source (nick and host), command, parameters).
// Expects the caller to pass a single message. (Remember, the Twitch
// IRC server may send one or more IRC messages in a single message.)

import { parseCommand } from './parseCommand';
import { parseTags } from './parseTags';
import type { ParsedMessage } from '../types';
import { parseSource } from './parseSource';
import { parseParameters } from './parseParameters';

export function parseMessage(message: string) {
  const parsedMessage: ParsedMessage = {
    // Contains the component parts.
    tags: null,
    source: null,
    command: null,
    parameters: null,
  };

  // The start index. Increments as we parse the IRC message.
  let idx = 0;

  // The raw components of the IRC message.
  let rawTagsComponent: string | null = null;
  let rawSourceComponent: string | null = null;
  let rawCommandComponent: string | null = null;
  let rawParametersComponent: string | null = null;

  // If the message includes tags, get the tags component of the IRC message.
  if (message[idx] === '@') {
    // The message includes tags.
    const endIdx = message.indexOf(' ');
    rawTagsComponent = message.slice(1, endIdx);
    idx = endIdx + 1; // Should now point to source colon (:).
  }

  // Get the source component (nick and host) of the IRC message.
  // The idx should point to the source part; otherwise, it's a PING command.
  if (message[idx] === ':') {
    idx += 1;
    const endIdx = message.indexOf(' ', idx);
    rawSourceComponent = message.slice(idx, endIdx);
    idx = endIdx + 1; // Should point to the command part of the message.
  }

  // Get the command component of the IRC message.
  let endIdx = message.indexOf(':', idx); // Looking for the parameters part of the message.
  if (-1 == endIdx) {
    // But not all messages include the parameters part.
    endIdx = message.length;
  }

  rawCommandComponent = message.slice(idx, endIdx).trim();

  // Get the parameters component of the IRC message.
  if (endIdx != message.length) {
    // Check if the IRC message contains a parameters component.
    idx = endIdx + 1; // Should point to the parameters part of the message.
    rawParametersComponent = message.slice(idx);
  }

  // Parse the command component of the IRC message.
  parsedMessage.command = parseCommand(rawCommandComponent);

  // Only parse the rest of the components if it's a command
  // we care about; we ignore some messages.
  if (parsedMessage.command === null) {
    // Is null if it's a message we don't care about.
    return null;
  } else {
    if (null !== rawTagsComponent) {
      // The IRC message contains tags.
      parsedMessage.tags = parseTags(rawTagsComponent);
    }

    parsedMessage.source = parseSource(rawSourceComponent);

    parsedMessage.parameters = rawParametersComponent;
    if (rawParametersComponent && rawParametersComponent[0] === '!') {
      // The user entered a bot command in the chat window.
      parsedMessage.command = parseParameters(rawParametersComponent, parsedMessage.command);
    }
  }

  return parsedMessage;
}
