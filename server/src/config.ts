import { existsSync, readFileSync } from 'fs';
import { logLevels, logger, type LogLevel } from './logger';
import { hasOwnProperty } from './utils/hasOwnProperty';

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

export type SpotifyConfig = {
  enabled: boolean;
  client_id: string;
  client_secret: string;
  grant_type: string;
  auth_code: string;
  redirect_uri: string;
  country_code: string;
};

export type GitHubConfig = {
  enabled: boolean;
  owner: string;
  repo: string;
  access_token: string;
};

export type SevenTVConfig = {
  enabled: boolean;
};

export type BetterTTVConfig = {
  enabled: boolean;
};

export type FrankerFaceZConfig = {
  enabled: boolean;
};

export type TikTokConfig = {
  enabled: boolean;
  session_id: string;
};

export type FeaturesConfig = {
  interval_commands: boolean;
  bit_handler: boolean;
  first_message_handler: boolean;
  first_message_of_stream_handler: boolean;
  returning_chatter_handler: boolean;
  commands_handler: boolean;
  events_handler: boolean;
};

interface IConfig {
  logLevel: LogLevel;
  twitch: TwitchConfig;
  webhooks: Record<string, WebhookConfig>;
  spotify: SpotifyConfig;
  github: GitHubConfig;
  sevenTV: SevenTVConfig;
  betterTTV: BetterTTVConfig;
  frankerFaceZ: FrankerFaceZConfig;
  tiktok: TikTokConfig;
  features: FeaturesConfig;
}

const configFileName = 'config.json';
const missingPropertyErrorMessage = (missingProperty: string) => `Missing configuration in ${configFileName}: ${missingProperty}`;
const invalidPropertyErrorMessage = (invalidProperty: string, validProperties: string[]) =>
  `Invalid configuration in ${configFileName}: ${invalidProperty}. It should be one of: ${validProperties.join(', ')}`;

export function assertConfigFileExists(): void {
  if (!existsSync(configFileName)) {
    logger.error(`Missing ${configFileName} file`);
    process.exit(1);
  }
}

function parseConfig<T>({ config, defaultConfig, part, properties }: { config: unknown; defaultConfig: T; part: string; properties: string[] }): T {
  if (!hasOwnProperty(config, part)) {
    logger.error(`Missing in config.json: ${part}`);

    return defaultConfig;
  }

  let loadedConfig: T = { ...defaultConfig };

  const configPart = config[part];

  if (!configPart || typeof configPart !== 'object') {
    logger.error(`Invalid ${part} config`);

    return defaultConfig;
  }

  for (const property of properties) {
    if (!hasOwnProperty(configPart, property)) {
      logger.error(missingPropertyErrorMessage(`${part}.${property}`));
    } else {
      loadedConfig = { ...loadedConfig, [property]: configPart[property] };
    }
  }

  return loadedConfig;
}

function readTwitchConfig(config: unknown): TwitchConfig {
  const defaultTwitchConfig: TwitchConfig = {
    broadcaster_id: '',
    client_id: '',
    client_secret: '',
    grant_type: '',
    account: '',
    channel: '',
    auth_code: '',
    redirect_uri: '',
  };

  const parsedTwitchConfig = parseConfig<TwitchConfig>({
    config,
    defaultConfig: defaultTwitchConfig,
    part: 'twitch',
    properties: ['broadcaster_id', 'client_id', 'client_secret', 'grant_type', 'account', 'channel', 'auth_code', 'redirect_uri'],
  });

  return parsedTwitchConfig;
}

function readSpotifyConfig(config: unknown): SpotifyConfig {
  const defaultSpotifyConfig: SpotifyConfig = {
    enabled: false,
    client_id: '',
    client_secret: '',
    grant_type: '',
    auth_code: '',
    redirect_uri: '',
    country_code: '',
  };

  const parsedSpotifyConfig = parseConfig<SpotifyConfig>({
    config,
    defaultConfig: defaultSpotifyConfig,
    part: 'spotify',
    properties: ['enabled', 'client_id', 'client_secret', 'grant_type', 'auth_code', 'redirect_uri', 'country_code'],
  });

  return parsedSpotifyConfig;
}

function readGitHubConfig(config: unknown): GitHubConfig {
  const defaultGitHubConfig: GitHubConfig = {
    enabled: false,
    owner: '',
    repo: '',
    access_token: '',
  };

  const parsedGitHubConfig = parseConfig<GitHubConfig>({
    config,
    defaultConfig: defaultGitHubConfig,
    part: 'github',
    properties: ['enabled', 'owner', 'repo', 'access_token'],
  });

  return parsedGitHubConfig;
}

function readSevenTVConfig(config: unknown): SevenTVConfig {
  const defaultSevenTVConfig: SevenTVConfig = {
    enabled: false,
  };

  const parsedSevenTVConfig = parseConfig<SevenTVConfig>({
    config,
    defaultConfig: defaultSevenTVConfig,
    part: 'seventv',
    properties: ['enabled', 'user_id'],
  });

  return parsedSevenTVConfig;
}

function readBetterTTVConfig(config: unknown): BetterTTVConfig {
  const defaultBetterTTVConfig: BetterTTVConfig = {
    enabled: false,
  };

  const parsedBetterTTVConfig = parseConfig<BetterTTVConfig>({
    config,
    defaultConfig: defaultBetterTTVConfig,
    part: 'betterttv',
    properties: ['enabled', 'provider', 'provider_id'],
  });

  return parsedBetterTTVConfig;
}

function readFrankerFaceZConfig(config: unknown): FrankerFaceZConfig {
  const defaultFrankerFaceZConfig: FrankerFaceZConfig = {
    enabled: false,
  };

  const parsedFrankerFaceZConfig = parseConfig<FrankerFaceZConfig>({
    config,
    defaultConfig: defaultFrankerFaceZConfig,
    part: 'frankerfacez',
    properties: ['enabled', 'broadcaster_id'],
  });

  return parsedFrankerFaceZConfig;
}

function readTikTokConfig(config: unknown): TikTokConfig {
  const defaultTikTokConfig: TikTokConfig = {
    enabled: false,
    session_id: '',
  };

  const parsedTikTokConfig = parseConfig<TikTokConfig>({
    config,
    defaultConfig: defaultTikTokConfig,
    part: 'tiktok',
    properties: ['enabled', 'session_id'],
  });

  return parsedTikTokConfig;
}

function readFeaturesConfig(config: unknown): FeaturesConfig {
  const defaultFeaturesConfig: FeaturesConfig = {
    interval_commands: true,
    bit_handler: true,
    first_message_handler: true,
    first_message_of_stream_handler: true,
    returning_chatter_handler: true,
    commands_handler: true,
    events_handler: true,
  };

  const parsedFeaturesConfig = parseConfig<FeaturesConfig>({
    config,
    defaultConfig: defaultFeaturesConfig,
    part: 'features',
    properties: [
      'interval_commands',
      'bit_handler',
      'first_message_handler',
      'first_message_of_stream_handler',
      'returning_chatter_handler',
      'commands_handler',
      'events_handler',
    ],
  });

  return parsedFeaturesConfig;
}

function readDiscordWebhookConfig(config: unknown): WebhookConfig {
  const defaultDiscordWebhookConfig: WebhookConfig = {
    enabled: false,
    service: 'discord',
    id: '',
    token: '',
    url: '',
  };

  const parsedDiscordWebhookConfig = parseConfig<WebhookConfig>({
    config,
    defaultConfig: defaultDiscordWebhookConfig,
    part: 'discord_webhook',
    properties: ['enabled', 'service', 'id', 'token', 'url'],
  });

  return parsedDiscordWebhookConfig;
}

function readLogLevel(config: unknown): LogLevel {
  const defaultLogLevel: LogLevel = 'info';

  if (!hasOwnProperty(config, 'log_level')) {
    logger.error(missingPropertyErrorMessage('log_level'));

    return defaultLogLevel;
  }

  const logLevel = config['log_level'];

  if (typeof logLevel !== 'string') {
    logger.error(`Invalid log_level config`);

    return defaultLogLevel;
  }

  if (typeof logLevel !== 'string' || (Array.isArray(logLevel) && !logLevels.includes(logLevel))) {
    logger.error(invalidPropertyErrorMessage('log_level', logLevels));

    return defaultLogLevel;
  }

  return logLevel;
}

const config: unknown = JSON.parse(readFileSync(configFileName, 'utf8'));

const Config: IConfig = {
  logLevel: readLogLevel(config),
  twitch: readTwitchConfig(config),
  webhooks: {
    discordChatHook: readDiscordWebhookConfig(config),
  },
  spotify: readSpotifyConfig(config),
  github: readGitHubConfig(config),
  sevenTV: readSevenTVConfig(config),
  betterTTV: readBetterTTVConfig(config),
  frankerFaceZ: readFrankerFaceZConfig(config),
  tiktok: readTikTokConfig(config),
  features: readFeaturesConfig(config),
};

export default Config;
