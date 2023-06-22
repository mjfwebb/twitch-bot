import assert from 'assert';
import { readFileSync } from 'fs';

import { hasOwnProperty } from './utils/hasOwnProperty';
import { isError } from './utils/isError';

export type WebhookConfig = {
  enabled: boolean;
  service: string;
  id: string;
  token: string;
  url: string;
};

export interface TwitchConfig {
  broadcaster_id: string;
  client_id: string;
  client_secret: string;
  grant_type: string;
  account: string;
  channel: string;
  auth_code: string;
  redirect_uri: string;
}

export type MongoDBConfig = {
  enabled: boolean;
  url: string;
  db: string;
};

export type SpotifyConfig = {
  enabled: boolean;
  client_id: string;
  client_secret: string;
  grant_type: string;
  auth_code: string;
  redirect_uri: string;
};

export type GitHubConfig = {
  enabled: boolean;
  owner: string;
  repo: string;
  access_token: string;
};

export type SevenTVConfig = {
  enabled: boolean;
  user_id: string;
};

export type BetterTTVConfig = {
  enabled: boolean;
  provider: string;
  provider_id: string;
};

export type FrankerFaceZConfig = {
  enabled: boolean;
  broadcaster_id: string;
};

export type FeaturesConfig = {
  interval_commands: boolean;
  bit_handler: boolean;
  first_message_handler: boolean;
  first_message_of_stream_handler: boolean;
  returning_chatter_handler: boolean;
  commands_handler: boolean;
};

interface IConfig {
  twitch: TwitchConfig;
  webhooks: Record<string, WebhookConfig>;
  mongoDB: MongoDBConfig;
  spotify: SpotifyConfig;
  github: GitHubConfig;
  sevenTV: SevenTVConfig;
  betterTTV: BetterTTVConfig;
  frankerFaceZ: FrankerFaceZConfig;
  features: FeaturesConfig;
}

const configFileName = 'config.json';
const missingPropertyErrorMessage = (missingProperty: string) => `Missing in ${configFileName}: ${missingProperty}`;

function checkConfig<T>(config: unknown, part: string, properties: string[]): asserts config is T {
  assert(hasOwnProperty(config, part), `Missing in config.json: ${part}`);
  for (const property of properties) {
    assert(hasOwnProperty(config[part], property), missingPropertyErrorMessage(`${part}.${property}`));
  }
}

function readTwitchConfig(config: unknown): TwitchConfig {
  try {
    checkConfig<{ twitch: TwitchConfig }>(config, 'twitch', [
      'broadcaster_id',
      'client_id',
      'client_secret',
      'grant_type',
      'account',
      'channel',
      'auth_code',
      'redirect_uri',
    ]);
    return config.twitch;
  } catch (error) {
    if (isError(error)) {
      console.log(`Error when loading Twitch config: ${error.message}`);
    }
  }
  throw new Error('Failed to read Twitch config');
}

function readSpotifyConfig(config: unknown): SpotifyConfig {
  try {
    checkConfig<{ spotify: SpotifyConfig }>(config, 'spotify', ['enabled', 'client_id', 'client_secret', 'grant_type', 'auth_code', 'redirect_uri']);
    return config.spotify;
  } catch (error) {
    if (isError(error)) {
      console.log(`Optional Spotify config error: ${error.message}`);
    }
  }
  return {
    enabled: false,
    client_id: '',
    client_secret: '',
    grant_type: '',
    auth_code: '',
    redirect_uri: '',
  };
}

function readGitHubConfig(config: unknown): GitHubConfig {
  try {
    checkConfig<{ github: GitHubConfig }>(config, 'github', ['enabled', 'owner', 'repo', 'access_token']);
    return config.github;
  } catch (error) {
    if (isError(error)) {
      console.log(`Optional GitHub config error: ${error.message}`);
    }
  }
  return {
    enabled: false,
    owner: '',
    repo: '',
    access_token: '',
  };
}

function readSevenTVConfig(config: unknown): SevenTVConfig {
  try {
    checkConfig<{ seventv: SevenTVConfig }>(config, 'seventv', ['enabled', 'user_id']);
    return config.seventv;
  } catch (error) {
    if (isError(error)) {
      console.log(`Optional SevenTV config error: ${error.message}`);
    }
  }
  return {
    enabled: false,
    user_id: '',
  };
}

function readBetterTTVConfig(config: unknown): BetterTTVConfig {
  try {
    checkConfig<{ betterttv: BetterTTVConfig }>(config, 'betterttv', ['enabled', 'provider', 'provider_id']);
    return config.betterttv;
  } catch (error) {
    if (isError(error)) {
      console.log(`Optional BetterTTV config error: ${error.message}`);
    }
  }
  return {
    enabled: false,
    provider: '',
    provider_id: '',
  };
}

function readFrankerFaceZConfig(config: unknown): FrankerFaceZConfig {
  try {
    checkConfig<{ frankerfacez: FrankerFaceZConfig }>(config, 'frankerfacez', ['enabled', 'broadcaster_id']);
    return config.frankerfacez;
  } catch (error) {
    if (isError(error)) {
      console.log(`Optional FrankerFaceZ config error: ${error.message}`);
    }
  }
  return {
    enabled: false,
    broadcaster_id: '',
  };
}

function readFeaturesConfig(config: unknown): FeaturesConfig {
  try {
    checkConfig<{ features: FeaturesConfig }>(config, 'features', [
      'interval_commands',
      'bit_handler',
      'first_message_handler',
      'first_message_of_stream_handler',
      'returning_chatter_handler',
      'commands_handler',
    ]);

    return config.features;
  } catch (error) {
    if (isError(error)) {
      console.log(`Optional features config error: ${error.message}`);
    }
  }
  return {
    interval_commands: true,
    bit_handler: true,
    first_message_handler: true,
    first_message_of_stream_handler: true,
    returning_chatter_handler: true,
    commands_handler: true,
  };
}

function readMongoDBConfig(config: unknown): MongoDBConfig {
  try {
    checkConfig<{ mongodb: MongoDBConfig }>(config, 'mongodb', ['enabled', 'url', 'db']);
    return config.mongodb;
  } catch (error) {
    if (isError(error)) {
      console.log(`Optional MongoDB config error: ${error.message}`);
    }
  }
  return {
    enabled: false,
    url: '',
    db: '',
  };
}

function readDiscordWebhookConfig(config: unknown): WebhookConfig {
  try {
    checkConfig<{ discord_webhook: WebhookConfig }>(config, 'discord_webhook', ['enabled', 'id', 'token', 'url']);
    return config.discord_webhook;
  } catch (error) {
    if (isError(error)) {
      console.log(`Optional Discord Webhook config error: ${error.message}`);
    }
  }
  return {
    enabled: false,
    service: 'discord',
    id: '',
    token: '',
    url: '',
  };
}

const config: unknown = JSON.parse(readFileSync(configFileName, 'utf8'));

const Config: IConfig = {
  twitch: readTwitchConfig(config),
  webhooks: {
    discordChatHook: readDiscordWebhookConfig(config),
  },
  mongoDB: readMongoDBConfig(config),
  spotify: readSpotifyConfig(config),
  github: readGitHubConfig(config),
  sevenTV: readSevenTVConfig(config),
  betterTTV: readBetterTTVConfig(config),
  frankerFaceZ: readFrankerFaceZConfig(config),
  features: readFeaturesConfig(config),
};

export default Config;
