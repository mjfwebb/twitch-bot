import type { HydratedDocument } from 'mongoose';
import { addburpee } from './commands/addburpee';
import { addcommand } from './commands/addcommand';
import { addissue } from './commands/addissue';
import { addpushup } from './commands/addpushup';
import { addsquat } from './commands/addsquat';
import { athanotime } from './commands/athanotime';
import { bot } from './commands/bot';
import { commands } from './commands/commands';
import { delvoid } from './commands/delvoid';
import { fail } from './commands/fail';
import { followage } from './commands/followage';
import { forodor } from './commands/forodor';
import { help } from './commands/help';
import { hasBotCommandParams } from './commands/helpers/hasBotCommandParams';
import { sendChatMessage } from './commands/helpers/sendChatMessage';
import { issue } from './commands/issue';
import { l } from './commands/l';
import { lurk } from './commands/lurk';
import { lutf1sk } from './commands/lutf1sk';
import { party } from './commands/party';
import { play } from './commands/play';
import { queuesong } from './commands/queuesong';
import { randomissue } from './commands/randomissue';
import { removecommand } from './commands/removecommand';
import { roll } from './commands/roll';
import { setalias } from './commands/setalias';
import { setcategory } from './commands/setcategory';
import { setcooldown } from './commands/setcooldown';
import { setdescription } from './commands/setdescription';
import { settags } from './commands/settags';
import { settask } from './commands/settask';
import { settitle } from './commands/settitle';
import { skipsong } from './commands/skipsong';
import { skiptts } from './commands/skiptts';
import { song } from './commands/song';
import { songqueue } from './commands/songqueue';
import { success } from './commands/success';
import { task } from './commands/task';
import { thechaosbean } from './commands/thechaosbean';
import { tts } from './commands/tts';
import { updateUser } from './commands/updateUser';
import { viewers } from './commands/viewers';
import { w } from './commands/w';
import { wary } from './commands/wary';
import { welcome } from './commands/welcome';
import { whoami } from './commands/whoami';
import Config from './config';
import { fetchChatters } from './handlers/twitch/helix/fetchChatters';
import type { Command } from './models/command-model';
import CommandModel from './models/command-model';
import type { BotCommand } from './types';
import { mention } from './utils/mention';

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
  addburpee,
  addcommand,
  addissue,
  addpushup,
  addsquat,
  athanotime,
  bot,
  commands,
  delvoid,
  fail,
  followage,
  forodor,
  help,
  issue,
  l,
  lurk,
  lutf1sk,
  party,
  play,
  queuesong,
  randomissue,
  removecommand,
  roll,
  setalias,
  setcategory,
  setcooldown,
  setdescription,
  settags,
  settask,
  settitle,
  skipsong,
  skiptts,
  song,
  songqueue,
  success,
  task,
  thechaosbean,
  tts,
  updateUser,
  viewers,
  w,
  wary,
  welcome,
  whoami,
];

async function loadMessageCommands(): Promise<BotCommand[]> {
  // If mongoDB isn't used then don't try to load these
  if (!Config.mongoDB) {
    return [];
  }

  const commands = await CommandModel.find({ message: { $ne: null } });

  type CommandWithMessage = HydratedDocument<Command> & { message: string; command: string };

  const botCommands: BotCommand[] = commands
    .filter((c): c is CommandWithMessage => !!(c.message && c.command))
    .map((c) => ({
      command: c.command,
      id: c.commandId,
      description: c.description || '',
      cooldown: c.cooldown || 0,
      callback: async (connection, parsedCommand) => {
        const command = await CommandModel.findOne({ command: c.command });
        if (!command) {
          return;
        }

        let target = 'unknown';
        if (hasBotCommandParams(parsedCommand.parsedMessage)) {
          const chatters = await fetchChatters();

          const botCommandParam = parsedCommand.parsedMessage.command.botCommandParams.split(' ')[0];
          if (chatters.findIndex((chatter) => chatter.user_login === botCommandParam || chatter.user_name === botCommandParam) > -1) {
            target = mention(botCommandParam);
          }
        }

        let user = 'unknown';
        if (parsedCommand.parsedMessage.tags && parsedCommand.parsedMessage.tags['display-name']) {
          user = parsedCommand.parsedMessage.tags['display-name'];
        }

        sendChatMessage(connection, c.message.replace('%user%', user).replace('%target%', target).replace('%count%', String(command.timesUsed)));
      },
    }));

  return botCommands;
}
