import assert from 'assert';
import { config } from 'dotenv';
import { readFileSync } from 'fs';

import { isError } from './utils/isError';

config({ path: `./.env.${process.env.NODE_ENV || ''}` });

export interface Webhook {
  service: string;
  id: string;
  token: string;
  url: string;
}

export interface TwitchConfig {
  broadcaster_id: string;
  client_id: string;
  client_secret: string;
  grant_type: string;
  oauth_password: string;
  account: string;
  channel: string;
  auth_code: string;
}

interface IConfig {
  environment: 'development' | 'production';
  twitch: TwitchConfig;
  webhooks: Record<string, Webhook>;
}

function assertTwitchConfig(config: unknown): asserts config is TwitchConfig {
  assert(Object.prototype.hasOwnProperty.call(config, 'broadcaster_id'), 'Missing Twitch config: broadcaster_id');
  assert(Object.prototype.hasOwnProperty.call(config, 'client_id'), 'Missing Twitch config: client_id');
  assert(Object.prototype.hasOwnProperty.call(config, 'client_secret'), 'Missing Twitch config: client_secret');
  assert(Object.prototype.hasOwnProperty.call(config, 'grant_type'), 'Missing Twitch config: grant_type');
  assert(Object.prototype.hasOwnProperty.call(config, 'oauth_password'), 'Missing Twitch config: oauth_password');
  assert(Object.prototype.hasOwnProperty.call(config, 'account'), 'Missing Twitch config: account');
  assert(Object.prototype.hasOwnProperty.call(config, 'channel'), 'Missing Twitch config: channel');
  assert(Object.prototype.hasOwnProperty.call(config, 'auth_code'), 'Missing Twitch config: auth_code');
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

function assertWebhookConfig(config: unknown): asserts config is Webhook {
  assert(Object.prototype.hasOwnProperty.call(config, 'service'), 'Missing Webhook config: service');
  assert(Object.prototype.hasOwnProperty.call(config, 'id'), 'Missing Webhook config: id');
  assert(Object.prototype.hasOwnProperty.call(config, 'token'), 'Missing Webhook config: token');
  assert(Object.prototype.hasOwnProperty.call(config, 'url'), 'Missing Webhook config: url');
}

function readDiscordWebhookConfig(): Webhook {
  try {
    const discordWebhookConfig: unknown = JSON.parse(readFileSync('./discordWebhookConfig.json', 'utf8'));
    assertWebhookConfig(discordWebhookConfig);
    return discordWebhookConfig;
  } catch (error) {
    if (isError(error)) {
      console.log(`Error when loading Discord Webhook config: ${error.message}`);
    }
  }
  throw new Error('Failed to read Discord Webhook config');
}

const Config: IConfig = {
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  twitch: readTwitchConfig(),
  webhooks: {
    discordChatHook: readDiscordWebhookConfig(),
  },
};

export default Config;
