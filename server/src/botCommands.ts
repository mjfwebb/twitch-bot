import { addcommand } from './commands/addcommand';
import { commands } from './commands/commands';
import { fetchcurrentsong } from './commands/fetchcurrentsong';
import { followage } from './commands/followage';
import { get } from './commands/get';
import { help } from './commands/help';
import { findBotCommand } from './commands/helpers/findBotCommand';
import { hasBotCommandParams } from './commands/helpers/hasBotCommandParams';
import { sendChatMessage } from './commands/helpers/sendChatMessage';
import { lastsong } from './commands/lastsong';
import { point } from './commands/point';
import { pointladder } from './commands/pointladder';
import { points } from './commands/points';
import { queuesong } from './commands/queuesong';
import { quote } from './commands/quote';
import { removealias } from './commands/removealias';
import { removecommand } from './commands/removecommand';
import { roll } from './commands/roll';
import { set } from './commands/set';
import { skipsong } from './commands/skipsong';
import { skiptts } from './commands/skiptts';
import { song } from './commands/song';
import { songqueue } from './commands/songqueue';
import { spotlight } from './commands/spotlight';
import { tts } from './commands/tts';
import { uptime } from './commands/uptime';
import { viewers } from './commands/viewers';
import { voices } from './commands/voices';
import { welcome } from './commands/welcome';
import { whoami } from './commands/whoami';
import Config from './config';
import { fetchChatters } from './handlers/twitch/helix/fetchChatters';
import { getConnection } from './handlers/twitch/irc/twitchIRCWebsocket';
import { playSound } from './playSound';
import { getIO } from './runSocketServer';
import type { Command } from './storage-models/command-model';
import { Commands } from './storage-models/command-model';
import type { BotCommand, BotCommandCallback } from './types';
import { mention } from './utils/mention';

const botCommands: BotCommand[] = [];

export function loadBotCommands() {
  botCommands.length = 0;
  const customCommands = loadCustomCommands();
  const spotifyCommands = loadSpotifyCommands();
  botCommands.push(...spotifyCommands, ...customCommands);
}

function loadBuiltInCommands(): BotCommand[] {
  if (Config.features.built_in_commands_handler) {
    return builtInCommands;
  }
  return [];
}

function loadCustomCommands(): BotCommand[] {
  if (Config.features.commands_handler) {
    const messageCommands = loadMessageCommands();

    // Need to merge the commands from the database with the message commands
    // as the messageCommands can contain aliases for the complex commands
    const loadedCommands = loadBuiltInCommands();
    for (const messageCommand of messageCommands) {
      const foundIndex = loadedCommands.findIndex((c) => c.id === messageCommand.id);
      if (foundIndex === -1) {
        loadedCommands.push(messageCommand);
      } else {
        loadedCommands[foundIndex].command = messageCommand.command;
      }
    }

    return loadedCommands;
  }
  return [];
}

export function loadSpotifyCommands(): BotCommand[] {
  if (Config.spotify.enabled) {
    return spotifyCommands;
  }
  return [];
}

export function getBotCommands(): BotCommand[] {
  return botCommands;
}

const spotifyCommands: BotCommand[] = [skipsong, song, songqueue, queuesong, lastsong, fetchcurrentsong];

const builtInCommands: BotCommand[] = [
  addcommand,
  commands,
  followage,
  help,
  point,
  points,
  pointladder,
  quote,
  removealias,
  removecommand,
  roll,
  skiptts,
  spotlight,
  tts,
  uptime,
  viewers,
  voices,
  welcome,
  whoami,
  set,
  get,
];

const soundMatchRegex = /%sound:([a-zA-Z0-9-_.]+)%/g;
const messageMatchRegex = /%emit:([a-zA-Z0-9-_.]+)%/g;
const commandMatchRegex = /%command:([a-zA-Z0-9-_.]+ .+)%/g;

export const messageWithoutTags = (message: string): string => {
  // Remove all instances of %sound:[something]% and %emit:[something]% from the message
  return message.replace(soundMatchRegex, '').replace(messageMatchRegex, '').replace(commandMatchRegex, '');
};

export const runMessageTags = async (message: string) => {
  const soundsToPlay: string[] = [];
  if (message.includes('%sound')) {
    let match;

    while ((match = soundMatchRegex.exec(message)) !== null) {
      soundsToPlay.push(match[1]);
    }
  }

  const messagesToEmit: string[] = [];
  if (message.includes('%emit')) {
    let match;

    while ((match = messageMatchRegex.exec(message)) !== null) {
      messagesToEmit.push(match[1]);
    }
  }

  const commandsToRun: string[] = [];
  if (message.includes('%command')) {
    let match;

    while ((match = commandMatchRegex.exec(message)) !== null) {
      commandsToRun.push(match[1]);
    }
  }

  // Emit all messages in sequence to the local socket server
  if (messagesToEmit.length > 0) {
    for (const message of messagesToEmit) {
      getIO().emit(message);
    }
  }

  // Play all sounds in sequence
  if (soundsToPlay.length > 0) {
    for (const sound of soundsToPlay) {
      if (sound.includes('.')) {
        const [soundName, soundExtension] = sound.split('.');
        if (soundExtension !== 'mp3') {
          // TODO: Support other sound formats
          continue;
        }
        await playSound(soundName, 'mp3');
      } else {
        // Default to wav
        await playSound(sound);
      }
    }
  }

  // Run all commands in sequence
  if (commandsToRun.length > 0) {
    const connection = getConnection();
    if (!connection) {
      return;
    }
    for (const command of commandsToRun) {
      const commandParts = command.split(' ');
      const params = commandParts.splice(1).join(' ');

      const botCommand = findBotCommand(commandParts[0]);
      if (botCommand) {
        await botCommand.callback(connection, {
          commandName: botCommand.id,
          botCommand,
          parsedMessage: {
            tags: {},
            source: {
              nick: Config.twitch.account,
              host: '',
            },
            parameters: '',
            command: {
              botCommand: botCommand.id,
              botCommandParams: params,
              command,
            },
          },
        });
      }
    }
  }
};

export const commandCallbackGenerator =
  (c: Command): BotCommandCallback =>
  async (connection, parsedCommand) => {
    const command = Commands.data.find((cmd) => cmd.command === c.command);
    if (!command) {
      return;
    }

    const message = messageWithoutTags(c.message);

    // If there was a message other than just sounds, send it
    if (message) {
      let target = '';
      if (message.includes('%target%') && hasBotCommandParams(parsedCommand.parsedMessage)) {
        const chatters = await fetchChatters();

        const botCommandParam = parsedCommand.parsedMessage.command.botCommandParams.split(' ')[0];
        if (chatters.findIndex((chatter) => chatter.user_login === botCommandParam || chatter.user_name === botCommandParam) > -1) {
          target = mention(botCommandParam);
        }
      }

      let user = 'unknown';
      if (message.includes('%user%') && parsedCommand.parsedMessage.tags && parsedCommand.parsedMessage.tags['display-name']) {
        user = parsedCommand.parsedMessage.tags['display-name'];
      }

      sendChatMessage(
        connection,
        message
          .replace('%user%', user)
          .replace('%target%', target)
          .replace('%now%', new Date().toTimeString())
          .replace('%count%', String(command.timesUsed + 1)),
      );
    }

    await runMessageTags(c.message);
  };

function loadMessageCommands(): BotCommand[] {
  const commands = Commands.data;

  const botCommands: BotCommand[] = commands.map((c) => ({
    command: c.command,
    id: c.commandId,
    description: c.description || '',
    cooldown: c.cooldown || 0,
    callback: async (connection, parsedCommand) => commandCallbackGenerator(c)(connection, parsedCommand),
    privileged: c.privileged || false,
  }));

  return botCommands;
}
