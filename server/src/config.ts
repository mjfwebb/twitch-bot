import { existsSync, readFileSync, writeFileSync } from 'fs';
import { logLevels, logger, type LogLevel } from './logger';
import { hasOwnProperty } from './utils/hasOwnProperty';

const webhookNames = ['discord_stream_notification'] as const;

type WebhookName = (typeof webhookNames)[number];

export type Webhook = {
  enabled: boolean;
  id: string;
  token: string;
  url: string;
};

export type WebhooksConfig = {
  [Key in WebhookName]: Webhook;
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
  scopes: string[];
}

export type SpotifyConfig = {
  enabled: boolean;
  client_id: string;
  client_secret: string;
  grant_type: string;
  auth_code: string;
  redirect_uri: string;
  country_code: string;
  scopes: string[];
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
  sub_handler: boolean;
  first_message_handler: boolean;
  first_message_of_stream_handler: boolean;
  returning_chatter_handler: boolean;
  commands_handler: boolean;
  built_in_commands_handler: boolean;
  events_handler: boolean;
};

export type RepeatMessageHandlerConfig = {
  enabled: boolean;
  timeout: number;
  repetition_requirement: number;
  voice: string;
  max_length: number;
};

interface Config {
  logLevel: LogLevel;
  twitch: TwitchConfig;
  webhooks: WebhooksConfig;
  spotify: SpotifyConfig;
  sevenTV: SevenTVConfig;
  betterTTV: BetterTTVConfig;
  frankerFaceZ: FrankerFaceZConfig;
  tiktok: TikTokConfig;
  repeatMessageHandler: RepeatMessageHandlerConfig;
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
    scopes: [],
  };

  const parsedTwitchConfig = parseConfig<TwitchConfig>({
    config,
    defaultConfig: defaultTwitchConfig,
    part: 'twitch',
    properties: ['broadcaster_id', 'client_id', 'client_secret', 'grant_type', 'account', 'channel', 'auth_code', 'redirect_uri', 'scopes'],
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
    scopes: [],
  };

  const parsedSpotifyConfig = parseConfig<SpotifyConfig>({
    config,
    defaultConfig: defaultSpotifyConfig,
    part: 'spotify',
    properties: ['enabled', 'client_id', 'client_secret', 'grant_type', 'auth_code', 'redirect_uri', 'country_code', 'scopes'],
  });

  return parsedSpotifyConfig;
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

function readRepeatMessageHandlerConfig(config: unknown): RepeatMessageHandlerConfig {
  const defaultRepeatMessageHandlerConfig: RepeatMessageHandlerConfig = {
    enabled: false,
    timeout: 20,
    repetition_requirement: 3,
    voice: 'Brian',
    max_length: 50,
  };

  const parsedRepeatMessageHandlerConfig = parseConfig<RepeatMessageHandlerConfig>({
    config,
    defaultConfig: defaultRepeatMessageHandlerConfig,
    part: 'repeat_message_handler',
    properties: ['enabled', 'timeout', 'repetition_requirement', 'voice', 'max_length'],
  });

  return parsedRepeatMessageHandlerConfig;
}

function readFeaturesConfig(config: unknown): FeaturesConfig {
  const defaultFeaturesConfig: FeaturesConfig = {
    interval_commands: true,
    bit_handler: true,
    sub_handler: true,
    first_message_handler: true,
    first_message_of_stream_handler: true,
    returning_chatter_handler: true,
    commands_handler: true,
    built_in_commands_handler: true,
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
      'built_in_commands_handler',
      'events_handler',
    ],
  });

  return parsedFeaturesConfig;
}

function readWebhooksConfig(config: unknown): WebhooksConfig {
  const defaultWebhooksConfig: WebhooksConfig = {
    [webhookNames[0]]: {
      enabled: false,
      id: '',
      token: '',
      url: '',
    },
  };

  if (!hasOwnProperty(config, 'webhooks')) {
    logger.error(missingPropertyErrorMessage('webhooks'));

    return defaultWebhooksConfig;
  }

  const webhookConfig: unknown = config['webhooks'];

  if (!Array.isArray(webhookConfig)) {
    logger.error(`Invalid webhooks config: should be an array`);

    return defaultWebhooksConfig;
  }

  if (webhookConfig.length !== webhookNames.length) {
    logger.error(`Invalid webhooks config: wrong number of webhooks`);

    return defaultWebhooksConfig;
  }

  const loadededWebhooksConfig: WebhooksConfig = { ...defaultWebhooksConfig };

  for (const webhookName of webhookNames) {
    const webhook = (webhookConfig as unknown[]).find((webhook) => {
      if (hasOwnProperty(webhook, 'name')) {
        return webhook['name'] === webhookName;
      }
    });

    if (!webhook) {
      logger.error(`Invalid webhooks config: missing ${webhookName} webhook`);

      return defaultWebhooksConfig;
    }

    let loadedWebhook: Record<string, unknown> = {};
    for (const property of ['enabled', 'id', 'token', 'url']) {
      if (!hasOwnProperty(webhook, property)) {
        logger.error(missingPropertyErrorMessage(`webhooks.${webhookName}.${property}`));

        return defaultWebhooksConfig;
      } else {
        loadedWebhook = { ...loadedWebhook, [property]: webhook[property] };
      }
    }

    loadededWebhooksConfig[webhookName] = loadedWebhook as Webhook;
  }

  return loadededWebhooksConfig;
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

export function updateConfigPart<T extends keyof Config, U extends keyof Config[T], V extends Config[T][U]>({
  part,
  property,
  value,
}: {
  part: T;
  property: U;
  value: V;
}): void {
  const currentData = JSON.parse(readFileSync(configFileName, 'utf8')) as Config;

  currentData[part][property] = value as Config[T][U];

  writeFileSync(configFileName, JSON.stringify(currentData, null, 2));
}

const loadedConfig: unknown = JSON.parse(readFileSync(configFileName, 'utf8'));

const Config: Config = {
  logLevel: readLogLevel(loadedConfig),
  twitch: readTwitchConfig(loadedConfig),
  webhooks: readWebhooksConfig(loadedConfig),
  spotify: readSpotifyConfig(loadedConfig),
  sevenTV: readSevenTVConfig(loadedConfig),
  betterTTV: readBetterTTVConfig(loadedConfig),
  frankerFaceZ: readFrankerFaceZConfig(loadedConfig),
  tiktok: readTikTokConfig(loadedConfig),
  repeatMessageHandler: readRepeatMessageHandlerConfig(loadedConfig),
  features: readFeaturesConfig(loadedConfig),
};

export default Config;
