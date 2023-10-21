import { findBotCommand } from './commands/helpers/findBotCommand';
import { sendChatMessage } from './commands/helpers/sendChatMessage';
import { SECOND_MS } from './constants';
import { getConnection } from './handlers/twitch/irc/twitchIRCWebsocket';
import type { IntervalCommand } from './storage-models/interval-command-model';
import { IntervalCommands } from './storage-models/interval-command-model';
import { StreamState } from './streamState';
import type { Command } from './types';
import { fakeParsedCommand } from './utils/fakeParsedCommand';

export const intervalCommands: IntervalCommand[] = [];

export const loadSpotifyIntervalCommands = () => {
  intervalCommands.push({
    actions: [
      {
        message: '',
        command: 'fetchcurrentsong',
        commandParams: '',
      },
    ],
    tickInterval: 5,
    currentTick: 0,
    startDelay: 0,
    mustBeStreaming: false,
  });
};

export const loadIntervalCommands = () => {
  intervalCommands.push(
    ...IntervalCommands.data.map((intervalCommand) => ({
      ...intervalCommand,
      currentTick: 0,
    })),
  );
};

export function runIntervalCommands() {
  async function runInterval() {
    const connection = getConnection();
    if (!connection) {
      return;
    }

    for (const intervalCommand of intervalCommands) {
      if (intervalCommand.currentTick === intervalCommand.tickInterval + intervalCommand.startDelay) {
        if (intervalCommand.mustBeStreaming) {
          if (StreamState.status !== 'online') {
            continue;
          }
        }

        for (const action of intervalCommand.actions) {
          if (action.message) {
            const connection = getConnection();
            if (connection) {
              sendChatMessage(connection, action.message.replace('%now%', new Date().toTimeString()));
            }
          }

          if (action.command) {
            const foundCommand = findBotCommand(action.command);
            if (foundCommand) {
              const connection = getConnection();
              if (connection) {
                const command: Command = {
                  command: action.command,
                  botCommand: action.command,
                  botCommandParams: action.commandParams,
                };

                await foundCommand.callback(connection, fakeParsedCommand(command));
              }
            }
          }
        }
        intervalCommand.currentTick = 0;
        intervalCommand.startDelay = 0;
      } else {
        intervalCommand.currentTick += 1;
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  setInterval(runInterval, SECOND_MS);
}
