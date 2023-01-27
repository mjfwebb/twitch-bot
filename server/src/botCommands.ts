import type { BotCommand } from './types';
import {
  setcooldown,
  setalias,
  addcommand,
  addpushup,
  addsquat,
  bot,
  command,
  commands,
  delvoid,
  fail,
  followage,
  forodor,
  issue,
  l,
  lurk,
  lutf1sk,
  party,
  play,
  roll,
  setcategory,
  setdescription,
  settags,
  settask,
  settitle,
  song,
  success,
  task,
  thechaosbean,
  tts,
  viewers,
  w,
  wary,
  welcome,
  whoami,
} from './commands';
import type { Command } from './models/command-model';
import CommandModel from './models/command-model';
import { sendChatMessage } from './commands/helpers/sendChatMessage';
import type { HydratedDocument } from 'mongoose';

const botCommands: BotCommand[] = [];

export async function loadBotCommands() {
  const messageCommands = await loadMessageCommands();
  botCommands.length = 0;
  botCommands.push(...complexBotCommands, ...messageCommands);
}

export function getBotCommands() {
  return botCommands;
}

const complexBotCommands: BotCommand[] = [
  setcooldown,
  setalias,
  addcommand,
  addpushup,
  addsquat,
  bot,
  command,
  commands,
  delvoid,
  fail,
  followage,
  forodor,
  issue,
  l,
  lurk,
  lutf1sk,
  party,
  play,
  roll,
  setcategory,
  setdescription,
  settags,
  settask,
  settitle,
  song,
  success,
  task,
  thechaosbean,
  tts,
  viewers,
  w,
  wary,
  welcome,
  whoami,
];

async function loadMessageCommands(): Promise<BotCommand[]> {
  const commands = await CommandModel.find({ message: { $ne: null } });

  type CommandWithMessage = HydratedDocument<Command> & { message: string; command: string };

  const botCommands: BotCommand[] = commands
    .filter((c): c is CommandWithMessage => !!(c.message && c.command))
    .map((c) => ({
      command: c.command,
      id: c.commandId,
      description: c.description || '',
      cooldown: c.cooldown || 0,
      callback: (connection) => {
        sendChatMessage(connection, c.message);
      },
    }));

  return botCommands;
}
