import assert from 'assert';
import { config } from 'dotenv';
import { readFileSync } from 'fs';

import { isError } from './utils/isError';

config({ path: `./.env.${process.env.NODE_ENV || ''}` });

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
  url: string;
  db: string;
} | null;

export type SpotifyConfig = {
  client_id: string;
  client_secret: string;
  grant_type: string;
  auth_code: string;
  redirect_uri: string;
} | null;

export type GitHubConfig = {
  owner: string;
  repo: string;
  access_token: string;
} | null;

export type SevenTVConfig = {
  userId: string;
} | null;

export type BetterTTVConfig = {
  provider: string;
  providerId: string;
} | null;

export type FrankerFaceZConfig = {
  broadcasterId: string;
} | null;

interface IConfig {
  environment: 'development' | 'production';
  twitch: TwitchConfig;
  webhooks: Record<string, WebhookConfig>;
  mongoDB: MongoDBConfig;
  spotify: SpotifyConfig;
  github: GitHubConfig;
  sevenTV: SevenTVConfig;
  betterTTV: BetterTTVConfig;
  frankerFaceZ: FrankerFaceZConfig;
}

function assertTwitchConfig(config: unknown): asserts config is TwitchConfig {
  assert(Object.prototype.hasOwnProperty.call(config, 'broadcaster_id'), 'Missing Twitch config: broadcaster_id');
  assert(Object.prototype.hasOwnProperty.call(config, 'client_id'), 'Missing Twitch config: client_id');
  assert(Object.prototype.hasOwnProperty.call(config, 'client_secret'), 'Missing Twitch config: client_secret');
  assert(Object.prototype.hasOwnProperty.call(config, 'grant_type'), 'Missing Twitch config: grant_type');
  assert(Object.prototype.hasOwnProperty.call(config, 'account'), 'Missing Twitch config: account');
  assert(Object.prototype.hasOwnProperty.call(config, 'channel'), 'Missing Twitch config: channel');
  assert(Object.prototype.hasOwnProperty.call(config, 'auth_code'), 'Missing Twitch config: auth_code');
  assert(Object.prototype.hasOwnProperty.call(config, 'redirect_uri'), 'Missing Twitch config: redirect_uri');
}

function readTwitchConfig(): TwitchConfig {
  try {
    const twitchConfig: unknown = JSON.parse(readFileSync('./twitchConfig.json', 'utf8'));
    assertTwitchConfig(twitchConfig);
    return twitchConfig;
  } catch (error) {
    if (isError(error)) {
      console.log(`Error when loading Twitch config: ${error.message}`);
    }
  }
  throw new Error('Failed to read Twitch config');
}

function assertSpotifyConfig(config: unknown): asserts config is SpotifyConfig {
  assert(Object.prototype.hasOwnProperty.call(config, 'client_id'), 'Missing Spotify config: client_id');
  assert(Object.prototype.hasOwnProperty.call(config, 'client_secret'), 'Missing Spotify config: client_secret');
  assert(Object.prototype.hasOwnProperty.call(config, 'grant_type'), 'Missing Spotify config: grant_type');
  assert(Object.prototype.hasOwnProperty.call(config, 'auth_code'), 'Missing Spotify config: auth_code');
  assert(Object.prototype.hasOwnProperty.call(config, 'redirect_uri'), 'Missing Spotify config: redirect_uri');
}

function readSpotifyConfig(): SpotifyConfig {
  try {
    const spotifyConfg: unknown = JSON.parse(readFileSync('./spotifyConfig.json', 'utf8'));
    assertSpotifyConfig(spotifyConfg);
    return spotifyConfg;
  } catch (error) {
    if (isError(error)) {
      console.log(`Optional Spotify config error: ${error.message}`);
    }
  }
  return null;
}

function assertGitHubConfig(config: unknown): asserts config is GitHubConfig {
  assert(Object.prototype.hasOwnProperty.call(config, 'owner'), 'Missing GitHub config: owner');
  assert(Object.prototype.hasOwnProperty.call(config, 'repo'), 'Missing GitHub config: repo');
  assert(Object.prototype.hasOwnProperty.call(config, 'access_token'), 'Missing GitHub config: access_token');
}

function readGitHubConfig(): GitHubConfig {
  try {
    const gitHubConfg: unknown = JSON.parse(readFileSync('./githubConfig.json', 'utf8'));
    assertGitHubConfig(gitHubConfg);
    return gitHubConfg;
  } catch (error) {
    if (isError(error)) {
      console.log(`Optional GitHub config error: ${error.message}`);
    }
  }
  return null;
}

function assertSevenTVConfig(config: unknown): asserts config is SevenTVConfig {
  assert(Object.prototype.hasOwnProperty.call(config, 'userId'), 'Missing SevenTV (7tv) config: userId');
}

function readSevenTVConfig(): SevenTVConfig {
  try {
    const sevenTVConfg: unknown = JSON.parse(readFileSync('./sevenTVConfig.json', 'utf8'));
    assertSevenTVConfig(sevenTVConfg);
    return sevenTVConfg;
  } catch (error) {
    if (isError(error)) {
      console.log(`Optional SevenTV config error: ${error.message}`);
    }
  }
  return null;
}

function assertBetterTTVConfig(config: unknown): asserts config is BetterTTVConfig {
  assert(Object.prototype.hasOwnProperty.call(config, 'provider'), 'Missing BetterTTV config: provider');
  assert(Object.prototype.hasOwnProperty.call(config, 'providerId'), 'Missing BetterTTV config: providerId');
}

function readBetterTTVConfig(): BetterTTVConfig {
  try {
    const betterTTVConfg: unknown = JSON.parse(readFileSync('./betterTTVConfig.json', 'utf8'));
    assertBetterTTVConfig(betterTTVConfg);
    return betterTTVConfg;
  } catch (error) {
    if (isError(error)) {
      console.log(`Optional BetterTTV config error: ${error.message}`);
    }
  }
  return null;
}

function assertFrankerFaceZConfig(config: unknown): asserts config is FrankerFaceZConfig {
  assert(Object.prototype.hasOwnProperty.call(config, 'broadcasterId'), 'Missing FrankerFaceZ config: broadcasterId');
}

function readFrankerFaceZConfig(): FrankerFaceZConfig {
  try {
    const frankerFaceZConfg: unknown = JSON.parse(readFileSync('./frankerFaceZConfig.json', 'utf8'));
    assertFrankerFaceZConfig(frankerFaceZConfg);
    return frankerFaceZConfg;
  } catch (error) {
    if (isError(error)) {
      console.log(`Optional FrankerFaceZ config error: ${error.message}`);
    }
  }
  return null;
}

function assertMongoDBConfig(config: unknown): asserts config is MongoDBConfig {
  assert(Object.prototype.hasOwnProperty.call(config, 'url'), 'Missing mongoDB config: url');
  assert(Object.prototype.hasOwnProperty.call(config, 'db'), 'Missing mongoDB config: db');
}

function readMongoDBConfig(): MongoDBConfig {
  try {
    const mongoDBConfg: unknown = JSON.parse(readFileSync('./mongoDBConfig.json', 'utf8'));
    assertMongoDBConfig(mongoDBConfg);
    return mongoDBConfg;
  } catch (error) {
    if (isError(error)) {
      console.log(`Optional MongoDB config error: ${error.message}`);
    }
  }
  return null;
}

function assertWebhookConfig(config: unknown): asserts config is WebhookConfig {
  assert(Object.prototype.hasOwnProperty.call(config, 'service'), 'Missing Webhook config: service');
  assert(Object.prototype.hasOwnProperty.call(config, 'id'), 'Missing Webhook config: id');
  assert(Object.prototype.hasOwnProperty.call(config, 'token'), 'Missing Webhook config: token');
  assert(Object.prototype.hasOwnProperty.call(config, 'url'), 'Missing Webhook config: url');
}

function readDiscordWebhookConfig(): WebhookConfig {
  try {
    const discordWebhookConfig: unknown = JSON.parse(readFileSync('./discordWebhookConfig.json', 'utf8'));
    assertWebhookConfig(discordWebhookConfig);
    return discordWebhookConfig;
  } catch (error) {
    if (isError(error)) {
      console.log(`Optional Discord Webhook config error: ${error.message}`);
    }
  }
  return null;
}

const Config: IConfig = {
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  twitch: readTwitchConfig(),
  webhooks: {
    discordChatHook: readDiscordWebhookConfig(),
  },
  mongoDB: readMongoDBConfig(),
  spotify: readSpotifyConfig(),
  github: readGitHubConfig(),
  sevenTV: readSevenTVConfig(),
  betterTTV: readBetterTTVConfig(),
  frankerFaceZ: readFrankerFaceZConfig(),
};

export default Config;
