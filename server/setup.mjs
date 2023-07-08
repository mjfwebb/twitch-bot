import checkbox from '@inquirer/checkbox';
import confirm from '@inquirer/confirm';
import { input } from '@inquirer/prompts';
import { readFileSync, writeFileSync } from 'fs';

function readJsonFile(filename) {
  try {
    const file = readFileSync(filename);
    const json = JSON.parse(file.toString());
    return json;
  } catch (err) {
    return null;
  }
};

function writeJsonFile(filename, json) {
  const file = JSON.stringify(json, null, 2);
  writeFileSync(filename, file);
}

async function main() {
  const exampleConfig = readJsonFile('./example.config.json');
  let currentConfig = readJsonFile('./config.json');
  if (currentConfig === null) {
    currentConfig = exampleConfig;
  }

  const confirmResult = await confirm({
    message: 'Have you made sure that no one else can see your screen?',
    default: false,
  });

  if (!confirmResult) {
    logger.error('You must make sure that no one else can see your screen');
    return;
  }

  const twitchConfigParts = [
    {
      name: 'broadcaster_id',
      default: undefined,
      help: 'The ID of the broadcaster account to use for the bot',
    },
    {
      name: 'client_id',
      default: undefined,
      help: 'The client ID of the application',
    },
    {
      name: 'client_secret',
      default: undefined,
      help: 'The client secret of the application',
    },
    {
      name: 'grant_type',
      default: exampleConfig.twitch.grant_type,
      help: 'The grant type of the application',
    },
    {
      name: 'account',
      default: undefined,
      help: "The account to use for the bot, for example 'athano'",
    },
    {
      name: 'channel',
      default: undefined,
      help: 'The channel to use for the bot, probably the same as the account',
    },
    {
      name: 'auth_code',
      default: undefined,
      help: 'The authorization code of the application. Obtain this using the URL from the documentation',
    },
    {
      name: 'redirect_uri', 
      default: exampleConfig.twitch.redirect_uri,
      help: 'The redirect URI of the application',
    },
  ];
  for (const part of twitchConfigParts) {
    const defaultValue = currentConfig.twitch[part.name] === part.name ? part.default : currentConfig.twitch[part.name];
    const answer = await input({ message: `Enter your twitch ${part.name} (${part.help})`, default: defaultValue });
    if (!answer) {
      logger.error(`You must enter twitch.${part}`);
      return;
    } else {
      currentConfig.twitch[part.name] = answer;
    }
  }
  
  // Disable all features by default
  currentConfig.spotify.enabled = false;
  currentConfig.seventv.enabled = false;
  currentConfig.betterttv.enabled = false;
  currentConfig.frankerfacez.enabled = false;
  currentConfig.discord_webhook.enabled = false;
  currentConfig.github.enabled = false;

  const selectedFeatures = await checkbox({
    message: 'Select optional features to enable',
    choices: [
      { name: 'spotify', value: 'spotify' , checked: true },
      { name: '7TV', value: 'seventv', checked: true },
      { name: 'BTTV', value: 'betterttv', checked: true },
      { name: 'FrankerFaceZ', value: 'frankerfacez', checked: true },
      { name: 'discord webhook', value: 'discord_webhook' },
      { name: 'github', value: 'github' },
    ],
  });

  // Enable selected features
  for (const selectedFeature of selectedFeatures) {
    switch (selectedFeature) {
      case 'github': {
        const githubConfigParts = [
          {
            name: 'owner',
            default: exampleConfig.github.url,
            help: 'The name of the github owner to use for the bot (usually the username)',
          },
          {
            name: 'repo',
            default: exampleConfig.github.db,
            help: 'The name of the github repository to use for the bot',
          },
          {
            name: 'access_token',
            default: undefined,
            help: 'The access token of the github account to use for the bot'
          }
        ];

        currentConfig.github.enabled = true;

        // Ask for each part of the github config
        for (const part of githubConfigParts) {
          const defaultValue = currentConfig.github[part.name] === part.name ? part.default : currentConfig.github[part.name];
          const answer = await input({ message: `Enter your github ${part.name} (${part.help})`, default: defaultValue });
          if (!answer) {
            logger.error(`You must enter github.${part}`);
            return;
          } else {
            currentConfig.github[part.name] = answer;
          }
        }
        break;
      }
      case 'spotify':{
        const spotifyConfigParts = [
          {
            name: 'client_id',
            default: undefined,
            help: 'The client ID of the spotify application',
          },
          {
            name: 'client_secret',
            default: undefined,
            help: 'The client secret of the spotify application',
          },
          {
            name: 'grant_type',
            default: exampleConfig.spotify.grant_type,
            help: 'The grant type of the spotify application',
          },
          {
            name: 'auth_code',
            default: undefined,
            help: 'The authorization code of the spotify application',
          },
          {
            name: 'redirect_uri',
            default: exampleConfig.spotify.redirect_uri,
            help: 'The redirect URI of the spotify application',
          },
        ];

        currentConfig.spotify.enabled = true;

        // Ask for each part of the spotify config
        for (const part of spotifyConfigParts) {
          const defaultValue = currentConfig.spotify[part.name] === part.name ? part.default : currentConfig.spotify[part.name];
          const answer = await input({ message: `Enter your spotify ${part.name} (${part.help})`, default: defaultValue });
          if (!answer) {
            logger.error(`You must enter spotify.${part}`);
            return;
          } else {
            currentConfig.spotify[part.name] = answer;
          }
        }
        break;
      }
      case 'seventv': {
        const seventvConfigParts = [
          {
            name: 'user_id',
            default: undefined,
            help: 'The user ID of the seventv account',
          },
        ];

        currentConfig.seventv.enabled = true;

        // Ask for each part of the seventv config
        for (const part of seventvConfigParts) {
          const defaultValue = currentConfig.seventv[part.name] === part.name ? part.default : currentConfig.seventv[part.name];
          const answer = await input({ message: `Enter your seventv ${part.name} (${part.help})`, default: defaultValue });
          if (!answer) {
            logger.error(`You must enter seventv.${part}`);
            return;
          } else {
            currentConfig.seventv[part.name] = answer;
          }
        }
        break;
      }

      case 'betterttv': {
        const betterttvConfigParts = [
          {
            name: 'provider',
            default: exampleConfig.betterttv.provider,
            help: "The name of the emote provider to use for the bot. Probably 'twitch'",
          },
          {
            name: 'provider_id',
            default: exampleConfig.betterttv.provider_id,
            help: 'The user ID from the emote provider to use for the bot.  Probably the same as the Twitch broadcaster ID',
          },
        ];

        currentConfig.betterttv.enabled = true;

        // Ask for each part of the betterttv config
        for (const part of betterttvConfigParts) {
          const defaultValue = currentConfig.betterttv[part.name] === part.name ? part.default : currentConfig.betterttv[part.name];
          const answer = await input({ message: `Enter your betterttv ${part.name} (${part.help})`, default: defaultValue });
          if (!answer) {
            logger.error(`You must enter betterttv.${part}`);
            return;
          } else {
            currentConfig.betterttv[part.name] = answer;
          }
        }
        break;
      }

      case 'frankerfacez': {
        const frankerfacezConfigParts = [
          {
            name: 'broadcaster_id',
            default: exampleConfig.frankerfacez.provider_id,
            help: 'The user ID from the emote provider to use for the bot. Probably the same as the Twitch broadcaster ID',
          },
        ];

        currentConfig.frankerfacez.enabled = true;

        // Ask for each part of the frankerfacez config
        for (const part of frankerfacezConfigParts) {
          const defaultValue = currentConfig.frankerfacez[part.name] === part.name ? part.default : currentConfig.frankerfacez[part.name];
          const answer = await input({ message: `Enter your frankerfacez ${part.name} (${part.help})`, default: defaultValue });
          if (!answer) {
            logger.error(`You must enter frankerfacez.${part}`);
            return;
          } else {
            currentConfig.frankerfacez[part.name] = answer;
          }
        }
        break;
      }

      case 'discord_webhook': {
        const discord_webhookConfigParts = [
          {
            name: 'id',
            default: exampleConfig.discord_webhook.id,
            help: 'The ID of the discord webhook to use for the bot',
          },
          {
            name: 'token',
            default: exampleConfig.discord_webhook.token,
            help: 'The token of the discord webhook to use for the bot',
          },
          {
            name: 'url',
            default: exampleConfig.discord_webhook.url,
            help: 'The URL of the discord webhook to use for the bot',
          }
        ];

        currentConfig.discord_webhook.enabled = true;

        // Ask for each part of the discord_webhook config
        for (const part of discord_webhookConfigParts) {
          const defaultValue = currentConfig.discord_webhook[part.name] === part.name ? part.default : currentConfig.discord_webhook[part.name];
          const answer = await input({ message: `Enter your discord_webhook ${part.name} (${part.help})`, default: defaultValue });
          if (!answer) {
            logger.error(`You must enter discord_webhook.${part}`);
            return;
          } else {
            currentConfig.discord_webhook[part.name] = answer;
          }
        }
        break;
      }
    }
  }

  console.log('Writing config to file...');

  writeJsonFile('./config.json', currentConfig);

  console.log('Done!');
}

void main();