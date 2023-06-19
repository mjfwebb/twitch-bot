import assert from 'assert';
import { readFileSync } from 'fs';

import { hasOwnProperty } from './utils/hasOwnProperty';
import { isError } from './utils/isError';

export type WebhookConfig = {
  service: string;
  id: string;
  token: string;
  url: string;
} | null;

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
  userId: string;
};

export type BetterTTVConfig = {
  enabled: boolean;
  provider: string;
  providerId: string;
};

export type FrankerFaceZConfig = {
  enabled: boolean;
  broadcasterId: string;
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
}

function assertTwitchConfig(config: unknown): asserts config is { twitch: TwitchConfig } {
  assert(hasOwnProperty(config, 'twitch'), 'Missing in config.json: twitch');
  assert(hasOwnProperty(config.twitch, 'broadcaster_id'), 'Missing in config.json: twitch.broadcaster_id');
  assert(hasOwnProperty(config.twitch, 'client_id'), 'Missing in config.json: twitch.client_id');
  assert(hasOwnProperty(config.twitch, 'client_secret'), 'Missing in config.json: twitch.client_secret');
  assert(hasOwnProperty(config.twitch, 'grant_type'), 'Missing in config.json: twitch.grant_type');
  assert(hasOwnProperty(config.twitch, 'account'), 'Missing in config.json: twitch.account');
  assert(hasOwnProperty(config.twitch, 'channel'), 'Missing in config.json: twitch.channel');
  assert(hasOwnProperty(config.twitch, 'auth_code'), 'Missing in config.json: twitch.auth_code');
  assert(hasOwnProperty(config.twitch, 'redirect_uri'), 'Missing in config.json: twitch.redirect_uri');
}

function readTwitchConfig(config: unknown): TwitchConfig {
  try {
    assertTwitchConfig(config);
    return config.twitch;
  } catch (error) {
    if (isError(error)) {
      console.log(`Error when loading Twitch config: ${error.message}`);
    }
  }
  throw new Error('Failed to read Twitch config');
}

function assertSpotifyConfig(config: unknown): asserts config is { spotify: SpotifyConfig } {
  assert(hasOwnProperty(config, 'spotify'), 'Missing in config.json: spotify');
  assert(hasOwnProperty(config.spotify, 'enabled'), 'Missing in config.json: spotify.enabled');
  assert(hasOwnProperty(config.spotify, 'client_id'), 'Missing in config.json: spotify.client_id');
  assert(hasOwnProperty(config.spotify, 'client_secret'), 'Missing in config.json: spotify.client_secret');
  assert(hasOwnProperty(config.spotify, 'grant_type'), 'Missing in config.json: spotify.grant_type');
  assert(hasOwnProperty(config.spotify, 'auth_code'), 'Missing in config.json: spotify.auth_code');
  assert(hasOwnProperty(config.spotify, 'redirect_uri'), 'Missing in config.json: spotify.redirect_uri');
}

function readSpotifyConfig(config: unknown): SpotifyConfig {
  try {
    assertSpotifyConfig(config);
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

function assertGitHubConfig(config: unknown): asserts config is { github: GitHubConfig } {
  assert(hasOwnProperty(config, 'github'), 'Missing in config.json: github');
  assert(hasOwnProperty(config.github, 'enabled'), 'Missing in config.json: github.enabled');
  assert(hasOwnProperty(config.github, 'owner'), 'Missing in config.json: github.owner');
  assert(hasOwnProperty(config.github, 'repo'), 'Missing in config.json: github.repo');
  assert(hasOwnProperty(config.github, 'access_token'), 'Missing in config.json: github.access_token');
}

function readGitHubConfig(config: unknown): GitHubConfig {
  try {
    assertGitHubConfig(config);
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

function assertSevenTVConfig(config: unknown): asserts config is { seventv: SevenTVConfig } {
  assert(hasOwnProperty(config, 'seventv'), 'Missing in config.json: seventv');
  assert(hasOwnProperty(config.seventv, 'enabled'), 'Missing in config.json: seventv.enabled');
  assert(hasOwnProperty(config.seventv, 'user_id'), 'Missing in config.json: seventv.user_id');
}

function readSevenTVConfig(config: unknown): SevenTVConfig {
  try {
    assertSevenTVConfig(config);
    return config.seventv;
  } catch (error) {
    if (isError(error)) {
      console.log(`Optional SevenTV config error: ${error.message}`);
    }
  }
  return {
    enabled: false,
    userId: '',
  };
}

function assertBetterTTVConfig(config: unknown): asserts config is { betterttv: BetterTTVConfig } {
  assert(hasOwnProperty(config, 'betterttv'), 'Missing BetterTTV config: betterttv');
  assert(hasOwnProperty(config.betterttv, 'enabled'), 'Missing in config.json: betterttv.enabled');
  assert(hasOwnProperty(config.betterttv, 'provider'), 'Missing in config.json: betterttv.provider');
  assert(hasOwnProperty(config.betterttv, 'provider_id'), 'Missing in config.json: betterttv.provider_id');
}

function readBetterTTVConfig(config: unknown): BetterTTVConfig {
  try {
    assertBetterTTVConfig(config);
    return config.betterttv;
  } catch (error) {
    if (isError(error)) {
      console.log(`Optional BetterTTV config error: ${error.message}`);
    }
  }
  return {
    enabled: false,
    provider: '',
    providerId: '',
  };
}

function assertFrankerFaceZConfig(config: unknown): asserts config is { frankerfacez: FrankerFaceZConfig } {
  assert(hasOwnProperty(config, 'frankerfacez'), 'Missing in config.json: frankerfacez');
  assert(hasOwnProperty(config.frankerfacez, 'enabled'), 'Missing in config.json: frankerfacez.enabled');
  assert(hasOwnProperty(config.frankerfacez, 'broadcaster_id'), 'Missing in config.json: frankerfacez.broadcaster_id');
}

function readFrankerFaceZConfig(config: unknown): FrankerFaceZConfig {
  try {
    assertFrankerFaceZConfig(config);
    return config.frankerfacez;
  } catch (error) {
    if (isError(error)) {
      console.log(`Optional FrankerFaceZ config error: ${error.message}`);
    }
  }
  return {
    enabled: false,
    broadcasterId: '',
  };
}

function assertMongoDBConfig(config: unknown): asserts config is { mongodb: MongoDBConfig } {
  assert(hasOwnProperty(config, 'mongodb'), 'Missing in config.json: mongodb');
  assert(hasOwnProperty(config.mongodb, 'enabled'), 'Missing in config.json: mongodb.enabled');
  assert(hasOwnProperty(config.mongodb, 'url'), 'Missing in config.json: mongodb.url');
  assert(hasOwnProperty(config.mongodb, 'db'), 'Missing in config.json: mongodb.db');
}

function readMongoDBConfig(config: unknown): MongoDBConfig {
  try {
    assertMongoDBConfig(config);
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

function assertWebhookConfig(config: unknown): asserts config is { discord_webhook: WebhookConfig } {
  assert(hasOwnProperty(config, 'discord_webhook'), 'Missing in config.json: discord_webhook');
  assert(hasOwnProperty(config.discord_webhook, 'enabled'), 'Missing in config.json: discord_webhook.enabled');
  assert(hasOwnProperty(config.discord_webhook, 'id'), 'Missing in config.json: discord_webhook.id');
  assert(hasOwnProperty(config.discord_webhook, 'token'), 'Missing in config.json: discord_webhook.token');
  assert(hasOwnProperty(config.discord_webhook, 'url'), 'Missing in config.json: discord_webhook.url');
}

function readDiscordWebhookConfig(config: unknown): WebhookConfig {
  try {
    assertWebhookConfig(config);
    return config.discord_webhook;
  } catch (error) {
    if (isError(error)) {
      console.log(`Optional Discord Webhook config error: ${error.message}`);
    }
  }
  return null;
}

const config: unknown = JSON.parse(readFileSync('./config.json', 'utf8'));

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
};

export default Config;
