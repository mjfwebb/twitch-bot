import { MINUTE_MS, REWARDS } from '../constants';
import { getUserIdByName } from '../helpers/getUserIdByName';
import { sendChatMessage } from '../helpers/sendChatMessage';
import { playSound } from '../playSound';
import type { BotCommand } from '../types';
import { isError } from '../utils/isError';
import { promiseAsyncWrapper } from '../utils/promiseAsyncWrapper';
import { editCustomReward, getCustomRewards } from './customRewards';
import { banUser, unbanUser } from './moderation';

export const botCommands: BotCommand[] = [
  {
    command: ['athanotime', 'time'],
    id: 'athanotime',
    callback: (connection) => {
      const now = new Date();
      sendChatMessage(connection, now.toTimeString());
    },
  },
  {
    command: 'addpushup',
    id: 'addpushup',
    priviliged: true,
    callback: (connection) => {
      promiseAsyncWrapper(async (resolve, reject) => {
        const customReward = getCustomRewards().find((customReward) => customReward.id === REWARDS.pushup);
        const amount = customReward?.title.split(' ')[0];

        if (amount) {
          const amountIncremented = +amount + 1;

          const body = JSON.stringify({
            title: customReward.title.replace(amount, String(amountIncremented)),
          });
          await editCustomReward(REWARDS.pushup, body);

          const pushupAddOneReward = getCustomRewards().find((customReward) => customReward.id === REWARDS.pushupAddOne);
          if (pushupAddOneReward) {
            await editCustomReward(
              REWARDS.pushupAddOne,
              JSON.stringify({
                cost: pushupAddOneReward.cost + 1000,
              }),
            );
          }
        } else {
          reject('Amount was not found');
        }
        sendChatMessage(connection, 'It goes ever upwards');
        resolve();
      });
    },
  },
  {
    command: 'party',
    id: 'party',
    priviliged: true,
    playTime: 9000,
    callback: (connection) => {
      sendChatMessage(connection, 'Time to party! 🎉');
      playSound('party');
    },
    cooldown: 10000,
  },
  {
    command: 'jumpy',
    id: 'jumpy',
    callback: (connection) => {
      sendChatMessage(connection, 'jumpylionnn is the best!!!');
    },
  },
  {
    command: 'success',
    id: 'success',
    priviliged: true,
    playTime: 5000,
    callback: () => {
      playSound('success');
    },
    cooldown: 10000,
  },
  {
    command: 'fail',
    id: 'fail',
    playTime: 5000,
    callback: () => {
      playSound('fail');
    },
    cooldown: 10000,
  },
  {
    command: 'resetdrop',
    id: 'resetdrop',
    callback: (connection) => {
      sendChatMessage(connection, '!resetdrop');
    },
    cooldown: 10 * MINUTE_MS,
  },
  {
    command: 'roilisi',
    id: 'roilisi',
    callback: (connection) => {
      sendChatMessage(connection, "You can try to break me, but you won't succeed UwU");
    },
  },
  {
    command: 'haliphax',
    id: 'haliphax',
    callback: (connection) => {
      sendChatMessage(connection, 'Go play https://yokai.quest/');
    },
  },
  {
    command: 'elephant',
    id: 'elephant',
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
    command: ['lutf1sk', 'lutfisk'],
    id: 'lutf1sk',
    mustBeUser: 'lutf1sk',
    hidden: true,
    callback: (connection) => {
      promiseAsyncWrapper(async () => {
        const lutfiskId = await getUserIdByName('lutf1sk');
        if (lutfiskId !== '') {
          sendChatMessage(connection, 'Get banned fool');
          setTimeout(() => {
            promiseAsyncWrapper(() => unbanUser(lutfiskId));
          }, 10000);
          await banUser(lutfiskId);
        }
      });
    },
    cooldown: 30 * MINUTE_MS,
  },
  {
    command: 'thanos',
    id: 'thanos',
    callback: (connection) => {
      sendChatMessage(connection, "Actually, it's Athanos");
    },
  },
  {
    command: 'stack2',
    id: 'stack2',
    callback: (connection) => {
      sendChatMessage(connection, 'Um, did you mean !stack by any chance?');
    },
  },
  {
    command: ['retrommo', 'evanmmo'],
    id: 'retrommo',
    callback: (connection) => {
      sendChatMessage(connection, 'Go play https://retro-mmo.com/');
    },
  },
  {
    command: 'redjaw',
    id: 'redjaw',
    callback: (connection) => {
      sendChatMessage(connection, 'Welcome to the Riazey gang! https://www.twitch.tv/riazey/clip/HotArtsyPuddingGOWSkull-s0cm7S54szpZ6VNy');
    },
  },
  {
    command: ['delvoid', 'delv'],
    id: 'delvoid',
    cooldown: 0.5 * MINUTE_MS,
    callback: (connection) => {
      sendChatMessage(connection, 'Delvoid: I hate eslint', 3);
    },
  },
  {
    command: 'forodor',
    id: 'forodor',
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
    id: 'thechaosbean',
    callback: () => {
      playSound('party');
    },
  },
  {
    command: 'bluepin',
    id: 'bluepin',
    callback: (connection) =>
      sendChatMessage(connection, 'Wishlist Explory Story on Steam! https://store.steampowered.com/app/1626280/Explory_Story/'),
  },
  {
    command: ['wary', 'Wary'],
    id: 'wary',
    callback: () => {
      playSound('oh_great_heavens');
    },
  },
  {
    command: 'cursor',
    id: 'cursor',
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
    id: 'w',
    callback: (connection, parsedMessage) => sendChatMessage(connection, `Big W ${parsedMessage.command?.botCommandParams || ''}`),
  },
  {
    command: 'l',
    id: 'l',
    callback: (connection, parsedMessage) => sendChatMessage(connection, `Fat L ${parsedMessage.command?.botCommandParams || ''}`),
  },
  {
    command: ['bot', 'github'],
    id: 'bot',
    callback: (connection) => sendChatMessage(connection, 'https://github.com/mjfwebb/twitch-bot'),
  },
  {
    command: ['discord', 'd'],
    id: 'discord',
    callback: (connection) => sendChatMessage(connection, 'Between Worlds Discord server: https://discord.betweenworlds.net'),
  },
  {
    command: 'challenge',
    id: 'challenge',
    callback: (c) => {
      sendChatMessage(c, 'For the current challenge, check out https://github.com/mjfwebb/twitch-bot/issues/16');
    },
  },
  {
    command: ['links'],
    id: 'links',
    callback: (connection) =>
      sendChatMessage(
        connection,
        '🚀 Game: https://www.betweenworlds.net 🚀 Discord: https://discord.betweenworlds.net 🚀 Patreon: https://www.patreon.com/athano 🚀 Twitter: https://twitter.com/athanoquest',
      ),
  },
  {
    command: 'commands',
    id: 'commands',
    hidden: true,
    callback: (connection) =>
      sendChatMessage(
        connection,
        `Available commands are: ${botCommands
          .filter((bc) => bc.hidden !== true)
          .map((bc) => bc.id)
          .join(', ')}`,
      ),
    cooldown: 5000,
  },
];
