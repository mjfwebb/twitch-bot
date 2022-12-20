import type websocket from 'websocket';

export type TwitchWebsocketMetadata = {
  message_id: string;
  message_type: 'session_welcome' | 'session_keepalive' | 'notification';
  message_timestamp: Date;
};

export type ChannelPointRedeemNotificatonEvent = {
  user_id: string;
  user_login: string;
  user_name: string;
  user_input: string;
  status: 'fulfilled' | 'unfulfilled';
  redeemed_at: Date;
  reward: {
    id: string;
    title: string;
    prompt: string;
    cost: number;
  };
};

export type TwitchWebsocketSessionData = {
  id: string;
  status: 'connected';
  connected_at: Date;
  keepalive_timeout_seconds: number;
  reconnect_url: null;
};

export type TwitchWebsocketMessage = {
  metadata: TwitchWebsocketMetadata;
  payload: {
    session?: TwitchWebsocketSessionData;
  };
};

export type Command = {
  command: string;
  channel?: string;
  isCapRequestEnabled?: boolean;
  botCommand?: string;
  botCommandParams?: string;
};

export type Source = {
  nick: string | null;
  host: string | null;
};

type Emote = {
  [key: string]: {
    startPosition: number;
    endPosition: number;
  }[];
};

type UserType = 'staff';

export type Tags = {
  'badge-info': {
    subscriber: number;
  };
  badges: {
    staff: number;
    broadcaster: number;
    turbo: number;
  };
  color: string;
  'display-name': string;
  'emote-only': number;
  emotes: Emote[];
  id: string;
  mod: string; // either '0' or '1'
  'room-id': number;
  subscriber: boolean;
  turbo: boolean;
  'tmi-sent-ts': string;
  'first-msg': boolean;
  'user-id': string;
  'user-type': UserType;
};

export type ParsedMessage = {
  tags: Tags | null;
  source: Source | null;
  command: Command | null;
  parameters: string | null;
};

export type BotCommandCooldown = {
  command: string;
  unusableUntil: number;
};

export type BotCommandCallback = (connection: websocket.connection, parsedMessage: ParsedMessage) => void;

export type BotCommand = {
  command: string | string[];
  id: string;
  callback: BotCommandCallback;
  playTime?: number;
  mustBeUser?: string;
  priviliged?: boolean;
  cooldown?: number;
  hidden?: boolean;
};
