import { MINUTE_MS, REWARDS } from '../constants';
import { getUserIdByName } from '../helpers/getUserIdByName';
import { sendChatMessage } from '../helpers/sendChatMessage';
import { playSound } from '../playSound';
import type { BotCommand } from '../types';
import { getRandomNumberInRange } from '../utils/getRandomNumberInRange';
import { endWithFullStop } from '../utils/endWithFullStop';
import { isError } from '../utils/isError';
import { msToTimeString } from '../utils/msToTimeString';
import { promiseAsyncWrapper } from '../utils/promiseAsyncWrapper';
import { editCustomReward, getCustomRewards } from './customRewards';
import { banUser, unbanUser } from './moderation';
import { ttsStreamElementsHandler } from './ttsStreamElementsHandler';

export const botCommands: BotCommand[] = [
  {
    command: ['athanotime', 'time'],
    id: 'athanotime',
    description: 'Tells you what it is where Athano is',
    callback: (connection) => {
      const now = new Date();
      sendChatMessage(connection, now.toTimeString());
    },
  },
  {
    command: ['roll'],
    id: 'roll',
    description: 'roll a number between the two numbers provided. Used like !roll 1 10',
    callback: (connection, parsedMessage) => {
      const rollBetween: string[] = parsedMessage.command?.botCommandParams?.split(' ') || [];
      if (parseInt(rollBetween[0]) && parseInt(rollBetween[1])) {
        const roll = getRandomNumberInRange(parseInt(rollBetween[0]), parseInt(rollBetween[1]));
        sendChatMessage(connection, `It's ${roll}!`);
      }
    },
  },
  {
    command: 'addpushup',
    id: 'addpushup',
    hidden: true,
    priviliged: true,
    callback: async (connection) => {
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
        sendChatMessage(connection, 'It goes ever upwards');
      }
    },
  },
  {
    command: 'party',
    id: 'party',
    priviliged: true,
    playTime: 9000,
    description: 'Starts a party',
    callback: async (connection) => {
      sendChatMessage(connection, 'Time to party! 🎉');
      await playSound('party');
    },
    cooldown: 10000,
  },
  {
    command: 'jumpy',
    id: 'jumpy',
    description: 'Added by jumpylionn',
    callback: (connection) => {
      sendChatMessage(connection, 'jumpylionnn is the best!!!');
    },
  },
  {
    command: 'success',
    id: 'success',
    description: 'Used when something goes well',
    priviliged: true,
    playTime: 5000,
    callback: async () => {
      await playSound('success');
    },
    cooldown: 10000,
  },
  {
    command: 'fail',
    id: 'fail',
    description: 'Used when something does not go well',
    playTime: 5000,
    callback: async () => {
      await playSound('fail');
    },
    cooldown: 10000,
  },
  {
    command: 'resetdrop',
    description: 'Reset the dropgame drop area',
    id: 'resetdrop',
    callback: (connection) => {
      sendChatMessage(connection, '!resetdrop');
    },
    cooldown: 10 * MINUTE_MS,
  },
  {
    command: 'roilisi',
    id: 'roilisi',
    description: 'Shows how resilient roilisi is',
    callback: (connection) => {
      sendChatMessage(connection, "You can try to break me, but you won't succeed UwU");
    },
  },
  {
    command: 'haliphax',
    description: "It's basically advertising",
    id: 'haliphax',
    callback: (connection) => {
      sendChatMessage(connection, 'Go play https://yokai.quest/');
    },
  },
  {
    command: 'elephant',
    id: 'elephant',
    description: 'Just look at it',
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
    command: 'lurk',
    id: 'lurk',
    description: "Say you'll be back soon",
    cooldown: 1 * MINUTE_MS,
    callback: (connection, parsedMessage) => {
      sendChatMessage(connection, `Thank you for the lurk ${parsedMessage.tags?.['display-name'] || '[unknown user]'}! Stay safe out there...`);
    },
  },
  {
    command: ['lutf1sk', 'lutfisk'],
    id: 'lutf1sk',
    mustBeUser: 'lutf1sk',
    description: 'It allows lutf1sk to ban himself',
    callback: async (connection) => {
      const lutfiskId = await getUserIdByName('lutf1sk');
      if (lutfiskId !== '') {
        sendChatMessage(connection, 'Get banned fool');
        setTimeout(() => {
          promiseAsyncWrapper(() => unbanUser(lutfiskId));
        }, 10000);
        await banUser(lutfiskId);
      }
    },
    cooldown: 30 * MINUTE_MS,
  },
  {
    command: 'thanos',
    id: 'thanos',
    description: "To help those who can't say the name properly",
    callback: (connection) => {
      sendChatMessage(connection, "Actually, it's Athanos");
    },
  },
  {
    command: 'stack2',
    id: 'stack2',
    description: 'It helps those in need',
    callback: (connection) => {
      sendChatMessage(connection, 'Um, did you mean !stack by any chance?');
    },
  },
  {
    command: ['retrommo', 'evanmmo'],
    id: 'retrommo',
    description: 'Blatant advertising',
    callback: (connection) => {
      sendChatMessage(connection, 'Go play https://retro-mmo.com/');
    },
  },
  {
    command: 'redjaw',
    id: 'redjaw',
    description: 'Welcome to the Riazey gang!',
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
    description: 'This command explains how much Delvoid loves eslint',
  },
  {
    command: 'forodor',
    id: 'forodor',
    mustBeUser: 'forodor',
    cooldown: 5 * MINUTE_MS,
    description: 'This is basically graffiti',
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
    description: "It's a party",
    callback: async () => {
      await playSound('party');
    },
  },
  {
    command: 'bluepin',
    id: 'bluepin',
    description: 'Blatant advertising',
    callback: (connection) =>
      sendChatMessage(connection, 'Wishlist Explory Story on Steam! https://store.steampowered.com/app/1626280/Explory_Story/'),
  },
  {
    command: ['wary', 'Wary'],
    id: 'wary',
    description: 'Just listen to it',
    callback: async () => {
      await playSound('oh_great_heavens');
    },
  },
  {
    command: 'tts',
    id: 'tts',
    description: 'Make your message audible! Used like !tts hello stream!',
    callback: async (_, parsedMessage) => {
      const params = parsedMessage.command?.botCommandParams;
      if (params) {
        await ttsStreamElementsHandler('Brian', params);
      }
    },
  },
  {
    command: 'cursor',
    id: 'cursor',
    description: 'Do you like how the VSCode cursor moves?',
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
    description: "It's a win",
    callback: (connection, parsedMessage) => sendChatMessage(connection, `Big W ${parsedMessage.command?.botCommandParams || ''}`),
  },
  {
    command: 'l',
    id: 'l',
    description: "It's a loss",
    callback: (connection, parsedMessage) => sendChatMessage(connection, `Fat L ${parsedMessage.command?.botCommandParams || ''}`),
  },
  {
    command: ['bot', 'github'],
    id: 'bot',
    description: "The Twitch Bot's github page",
    callback: (connection) => sendChatMessage(connection, 'https://github.com/mjfwebb/twitch-bot'),
  },
  {
    command: ['discord', 'd'],
    id: 'discord',
    description: 'The Between Worlds discord link',
    callback: (connection) => sendChatMessage(connection, 'Between Worlds Discord server: https://discord.betweenworlds.net'),
  },
  {
    command: 'stack',
    id: 'stack',
    description: 'The real stack command. These are the technologies used',
    callback: (connection) => {
      sendChatMessage(connection, 'Typescript, React, NodeJS, Socket.io, mongoDB (Mongoose), Digital Ocean droplet, Firebase');
    },
  },
  {
    command: 'challenge',
    id: 'challenge',
    description: 'Want to help with complex Typescript? Try this out.',
    callback: (connection) => {
      sendChatMessage(connection, 'For the current challenge, check out https://github.com/mjfwebb/twitch-bot/issues/16');
    },
  },
  {
    command: ['links'],
    id: 'links',
    description: 'Get links for related webpages',
    callback: (connection) =>
      sendChatMessage(
        connection,
        '🚀 Game: https://www.betweenworlds.net 🚀 Discord: https://discord.betweenworlds.net 🚀 Patreon: https://www.patreon.com/athano 🚀 Twitter: https://twitter.com/athanoquest',
      ),
  },
  {
    command: 'flappieh',
    id: 'flappieh',
    description: 'In honour of those who were missed',
    callback: (connection) => {
      sendChatMessage(connection, 'My actual hero ♥');
    },
  },
  {
    command: 'command',
    id: 'command',
    description: 'Use this command to find out more about a command',
    callback: (connection, parsedMessage) => {
      const commandParam = parsedMessage.command?.botCommandParams;

      if (commandParam) {
        const foundCommand = botCommands.find((command) => {
          if (Array.isArray(command.command)) {
            return command.command.includes(commandParam);
          } else {
            return command.command === commandParam;
          }
        });

        if (!foundCommand || foundCommand.hidden) {
          sendChatMessage(connection, `I don't know what the command ${commandParam} is?!`);
        } else {
          const start = `You want to know about ${commandParam}? Here's what we know:`;
          const description = foundCommand.description ?? '';
          const useBy = foundCommand.mustBeUser ? `It may only be used by ${foundCommand.mustBeUser}.` : '';
          const cooldown = foundCommand.cooldown ? `It may only be used once every ${msToTimeString(foundCommand.cooldown)}` : '';
          const aliases =
            Array.isArray(foundCommand.command) && foundCommand.command.length > 1
              ? `It can be invoked using ${foundCommand.command.length} aliases: ${foundCommand.command.join(', ')}`
              : '';

          sendChatMessage(
            connection,
            [start, description, useBy, cooldown, aliases]
              .filter((text) => !!text)
              .map((text) => endWithFullStop(text))
              .join(' '),
          );
        }
      }
    },
    cooldown: 5000,
  },
  {
    command: 'commands',
    id: 'commands',
    description: "It's the commands command to see the commands",
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
