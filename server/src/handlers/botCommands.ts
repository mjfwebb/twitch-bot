import { MINUTE_MS, REWARDS } from '../constants';
import { sendChatMessage } from '../helpers/sendChatMessage';
import { playSound } from '../playSound';
import type { BotCommand } from '../types';
import { isError } from '../utils/isError';
import { editCustomReward, getCustomRewards } from './customRewards';

export const botCommands: BotCommand[] = [
  {
    command: 'addpushup',
    priviliged: true,
    callback: (connection) => {
      new Promise<void>((resolve, reject) => {
        void (async () => {
          const customReward = getCustomRewards().find((customReward) => customReward.id === REWARDS.pushup);
          const amount = customReward?.title.split(' ')[0];

          if (amount) {
            const amountIncremented = +amount + 1;

            const body = JSON.stringify({
              title: customReward.title.replace(amount, String(amountIncremented)),
            });
            await editCustomReward(REWARDS.pushup, body);
          } else {
            reject('Amount was not found');
          }
          sendChatMessage(connection, 'It goes ever upwards');
          resolve();
        })();
      }).catch((e) => console.log(e));
    },
  },
  {
    command: 'party',
    priviliged: true,
    playTime: 9000,
    callback: (connection) => {
      sendChatMessage(connection, 'Time to party! 🎉');
      playSound('party');
    },
    cooldown: 10000,
  },
  {
    command: 'success',
    priviliged: true,
    playTime: 5000,
    callback: () => {
      playSound('success');
    },
    cooldown: 10000,
  },
  {
    command: 'fail',
    playTime: 5000,
    callback: () => {
      playSound('fail');
    },
    cooldown: 10000,
  },
  {
    command: 'resetdrop',
    callback: (connection) => {
      sendChatMessage(connection, '!resetdrop');
    },
    cooldown: 10 * MINUTE_MS,
  },
  {
    command: 'roilisi',
    callback: (connection) => {
      sendChatMessage(connection, "You can try to break me, but you won't succeed UwU");
    },
  },
  {
    command: 'haliphax',
    callback: (connection) => {
      sendChatMessage(connection, 'Go play https://yokai.quest/');
    },
  },
  {
    command: 'elephant',
    cooldown: 1 * MINUTE_MS,
    callback: (connection) => {
      sendChatMessage(
        connection,
        // eslint-disable-next-line max-len
        '░▒░█░░░░░░░░░░░░░░░░ ░░░█░░░░░░░░░░░░░░░░ ░░█░░░░███████░░░░░░ ░██░░░██▓▓███▓██▒░░░ ██░░░█▓▓▓▓▓▓▓█▓████░ ██░░██▓▓▓(O)▓█▓█▓█░░ ███▓▓▓█▓▓▓▓▓█▓█▓▓▓▓█ ▀██▓▓█░██▓▓▓▓██▓▓▓▓▓█ ░▀██▀░░█▓▓▓▓▓▓▓▓▓▓▓▓▓█ ░░░░▒░░░█▓▓▓▓▓█▓▓▓▓▓▓█ ░░░░▒░░░█▓▓▓▓█▓█▓▓▓▓▓█ ░▒░░▒░░░█▓▓▓█▓▓▓█▓▓▓▓█ ░▒░░▒░░░█▓▓▓█░░░█▓▓▓█ ░▒░░▒░░██▓██░░░██▓▓██',
      );
    },
  },
  {
    command: 'lutf1sk',
    mustBeUser: 'lutf1sk',
    hidden: true,
    callback: (connection) => {
      sendChatMessage(connection, 'Get banned fool');
      setTimeout(() => {
        sendChatMessage(connection, '/unban lutf1sk');
      }, 10000);
      sendChatMessage(connection, '/ban lutf1sk');
    },
    cooldown: 30 * MINUTE_MS,
  },
  {
    command: 'thanos',
    callback: (connection) => {
      sendChatMessage(connection, "Actually, it's Athanos");
    },
  },
  {
    command: 'stack2',
    callback: (connection) => {
      sendChatMessage(connection, 'Um, did you mean !stack by any chance?');
    },
  },
  {
    command: 'retrommo',
    callback: (connection) => {
      sendChatMessage(connection, 'Go play https://retro-mmo.com/');
    },
  },
  {
    command: 'redjaw',
    callback: (connection) => {
      sendChatMessage(connection, 'Welcome to the Riazey gang! https://www.twitch.tv/riazey/clip/HotArtsyPuddingGOWSkull-s0cm7S54szpZ6VNy');
    },
  },
  {
    command: 'delvoid',
    callback: (connection) => {
      sendChatMessage(connection, 'Delvoid: I hate eslint', 3);
    },
  },
  {
    command: 'forodor',
    mustBeUser: 'forodor',
    cooldown: 5 * MINUTE_MS,
    callback: (connection) => {
      sendChatMessage(connection, 'null is just a number');
      try {
        throw new Error('Forodor was here');
      } catch (error) {
        if (isError(error)) {
          console.log(error);
          sendChatMessage(connection, error.message);
        }
      }
    },
  },
  {
    command: 'thechaosbean',
    callback: () => {
      playSound('party');
    },
  },
  {
    command: 'bluepin',
    callback: (connection) =>
      sendChatMessage(connection, 'Wishlist Explory Story on Steam! https://store.steampowered.com/app/1626280/Explory_Story/'),
  },
  {
    command: 'cursor',
    callback: (connection) =>
      sendChatMessage(
        connection,
        `"editor.cursorBlinking": "expand",
        "editor.cursorWidth": 3,
        "editor.cursorSmoothCaretAnimation": true,`,
      ),
  },
  {
    command: 'w',
    callback: (connection, parsedMessage) => sendChatMessage(connection, `Big W ${parsedMessage.command?.botCommandParams || ''}`),
  },
  {
    command: 'l',
    callback: (connection, parsedMessage) => sendChatMessage(connection, `Fat L ${parsedMessage.command?.botCommandParams || ''}`),
  },
  {
    command: 'commands',
    hidden: true,
    callback: (connection) =>
      sendChatMessage(
        connection,
        `Available commands are: ${botCommands
          .filter((bc) => bc.hidden !== true)
          .map((bc) => bc.command)
          .join(', ')}`,
      ),
    cooldown: 5000,
  },
];
