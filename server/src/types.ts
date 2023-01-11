/* eslint-disable max-len */
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

export type EventSubCondition = { [key: string]: string };

export type EventSubResponse = {
  subscription: EventsubSubscription;
  event:
    | ChannelSubscriptionEvent
    | ChannelSubscriptionGiftEvent
    | RaidNotificationEvent
    | FollowNotificationEvent
    | ChannelPointRedeemNotificatonEvent
    | StreamOnlineNotificationEvent
    | StreamOfflineNotificationEvent;
};

export type EventsubSubscription = {
  type: EventsubSubscriptionType;
};

export type EventsubSubscriptionType =
  | 'channel.update'
  | 'channel.follow'
  | 'channel.subscribe'
  | 'channel.subscription.end'
  | 'channel.subscription.gift'
  | 'channel.subscription.message'
  | 'channel.cheer'
  | 'channel.raid'
  | 'channel.ban'
  | 'channel.unban'
  | 'channel.moderator.add'
  | 'channel.moderator.remove'
  | 'channel.channel_points_custom_reward.add'
  | 'channel.channel_points_custom_reward.update'
  | 'channel.channel_points_custom_reward.remove'
  | 'channel.channel_points_custom_reward_redemption.add'
  | 'channel.channel_points_custom_reward_redemption.update'
  | 'channel.poll.begin'
  | 'channel.poll.progress'
  | 'channel.poll.end'
  | 'channel.prediction.begin'
  | 'channel.prediction.progress'
  | 'channel.prediction.lock'
  | 'channel.prediction.end'
  | 'channel.charity_campaign.donate'
  | 'channel.charity_campaign.start'
  | 'channel.charity_campaign.progress'
  | 'channel.charity_campaign.stop'
  | 'drop.entitlement.grant'
  | 'extension.bits_transaction.create'
  | 'channel.goal.begin'
  | 'channel.goal.progress'
  | 'channel.goal.end'
  | 'channel.hype_train.begin'
  | 'channel.hype_train.progress'
  | 'channel.hype_train.end'
  | 'channel.shield_mode.begin'
  | 'channel.shield_mode.end'
  | 'stream.online'
  | 'stream.offline'
  | 'user.authorization.grant'
  | 'user.authorization.revoke'
  | 'user.update';

export type StreamOnlineNotificationEvent = {
  id: string; // The id of the stream.
  broadcaster_user_id: string; // The broadcaster’s user id.
  broadcaster_user_login: string; // The broadcaster’s user login.
  broadcaster_user_name: string; // The broadcaster’s user display name.
  type: string; // The stream type. Valid values are: live, playlist, watch_party, premiere, rerun.
  started_at: string; // The timestamp at which the stream went online at.
};

export type StreamOfflineNotificationEvent = {
  broadcaster_user_id: string; // The broadcaster’s user id.
  broadcaster_user_login: string; // The broadcaster’s user login.
  broadcaster_user_name: string; // The broadcaster’s user display name.
};

export type ChannelSubscriptionEvent = {
  user_id: string; // The user ID for the user who subscribed to the specified channel.
  user_login: string; // The user login for the user who subscribed to the specified channel.
  user_name: string; // The user display name for the user who subscribed to the specified channel.
  broadcaster_user_id: string; // The requested broadcaster ID.
  broadcaster_user_login: string; // The requested broadcaster login.
  broadcaster_user_name: string; // The requested broadcaster display name.
  tier: string; // The tier of the subscription. Valid values are 1000, 2000, and 3000.
  is_gift: boolean; // Whether the subscription is a gift.
};

export type ChannelSubscriptionGiftEvent = {
  user_id: string; /// The user ID of the user who sent the subscription gift. Set to null if it was an anonymous subscription gift.
  user_login: string; /// The user login of the user who sent the gift. Set to null if it was an anonymous subscription gift.
  user_name: string; /// The user display name of the user who sent the gift. Set to null if it was an anonymous subscription gift.
  broadcaster_user_id: string; /// The broadcaster user ID.
  broadcaster_user_login: string; /// The broadcaster login.
  broadcaster_user_name: string; /// The broadcaster display name.
  total: number; /// The number of subscriptions in the subscription gift.
  tier: string; /// The tier of subscriptions in the subscription gift.
  cumulative_total: number; /// The number of subscriptions gifted by this user in the channel. This value is null for anonymous gifts or if the gifter has opted out of sharing this information.
  is_anonymous: boolean; /// Whether the subscription gift was anonymous.
};

export type RaidNotificationEvent = {
  from_broadcaster_user_id: string; // The broadcaster ID that created the raid.
  from_broadcaster_user_login: string; // The broadcaster login that created the raid.
  from_broadcaster_user_name: string; // The broadcaster display name that created the raid.
  to_broadcaster_user_id: string; // The broadcaster ID that received the raid.
  to_broadcaster_user_login: string; // The broadcaster login that received the raid.
  to_broadcaster_user_name: string; // The broadcaster display name that received the raid.
  viewers: number; //The number of viewers in the raid.
};

export type FollowNotificationEvent = {
  user_id: string; // The user ID for the user now following the specified channel.
  user_login: string; // The user login for the user now following the specified channel.
  user_name: string; // The user display name for the user now following the specified channel.
  broadcaster_user_id: string; // The requested broadcaster ID.
  broadcaster_user_login: string; // The requested broadcaster login.
  broadcaster_user_name: string; // The requested broadcaster display name.
  followed_at: string; // RFC3339 timestamp of when the follow occurred.
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

type Emotes = Emote[];

/**
 * The type of user. Possible values are:
 *  null — A normal user, an empty string from the API, parsed as null by the tags parser
 *  admin — A Twitch administrator
 *  global_mod — A global moderator
 *  staff — A Twitch employee
 */
type UserType = null | 'admin' | 'global_mod' | 'staff';

/**
 *  A string containing a number value of either '0' or '1'
 */
type StringBoolean = '0' | '1';

/**
 *  A string containing a number value such as '69'
 */
type StringNumber = string;

/**
 * Contains metadata related to the chat badges in the badges tag.
 * Currently, this tag contains metadata only for subscriber badges, to indicate the number of months the user has been a subscriber.
 */
type BadgeInfo = {
  subscriber: StringNumber;
  founder: StringNumber;
};

/**
 *  There are many possible badge values, but here are few
 */
type Badges = {
  admin: StringBoolean;
  bits: StringBoolean;
  broadcaster: StringBoolean;
  moderator: StringBoolean;
  subscriber: StringBoolean;
  staff: StringBoolean;
  turbo: StringBoolean;
};

/**
 * The type of notice (not the ID)
 */
type MessageId =
  | 'sub'
  | 'resub'
  | 'subgift'
  | 'submysterygift'
  | 'giftpaidupgrade'
  | 'rewardgift'
  | 'anongiftpaidupgrade'
  | 'raid'
  | 'unraid'
  | 'ritual'
  | 'bitsbadgetier';

type CommonTags = {
  'badge-info': BadgeInfo;
  badges: Badges;
  color: string; // The color of the user’s name in the chat room. This is a hexadecimal RGB color code in the form, #<RGB>. This tag may be empty if it is never set.
  'display-name': string; // 	The user’s display name, escaped as described in the IRCv3 spec. This tag may be empty if it is never set.
  emotes: Emotes;
  id: string;
  mod: StringBoolean;
  'room-id': number;
  subscriber: StringBoolean;
  'tmi-sent-ts': string;
  turbo: StringBoolean;
  'user-id': string;
  'user-type': UserType;
};

export type UserStateTags = {
  'badge-info': BadgeInfo;
  badges: Badges;
  color: string; // The color of the user’s name in the chat room. This is a hexadecimal RGB color code in the form, #<RGB>. This tag may be empty if it is never set.
  'display-name': string; // 	The user’s display name, escaped as described in the IRCv3 spec. This tag may be empty if it is never set.
  'emote-sets': string[];
  turbo: StringBoolean;
  'user-id': string;
  'user-type': UserType;
};

export type NoticeTags = {
  'msg-id': string | 'resub';
  'target-user-id': string;
};

export type PrivMsgTags = CommonTags & {
  bits: StringNumber;
  'returning-chatter': StringBoolean;
  'reply-parent-msg-id': string; // An ID that uniquely identifies the parent message that this message is replying to. The message does not include this tag if this message is not a reply.
  'reply-parent-user-id': string; // An ID that identifies the sender of the parent message. The message does not include this tag if this message is not a reply.
  'reply-parent-user-login': string; // The login name of the sender of the parent message. The message does not include this tag if this message is not a reply.
  'reply-parent-display-name': string; // The display name of the sender of the parent message. The message does not include this tag if this message is not a reply.
  'reply-parent-msg-body': string; // The text of the parent message. The message does not include this tag if this message is not a reply.
  'first-msg': StringBoolean;
  vip: StringBoolean; // A Boolean value that determines whether the user that sent the chat is a VIP. The message includes this tag if the user is a VIP; otherwise, the message doesn’t include this tag (check for the presence of the tag instead of whether the tag is set to true or false).
};

export type RoomstateTags = {
  'emote-only': StringBoolean; // A Boolean value that determines whether the chat room allows only messages with emotes. Is true (1) if only emotes are allowed; otherwise, false (0).
  'followers-only': StringNumber; // An integer value that determines whether only followers can post messages in the chat room. The value indicates how long, in minutes, the user must have followed the broadcaster before posting chat messages. If the value is -1, the chat room is not restricted to followers only.
  r9k: StringBoolean; // A Boolean value that determines whether a user’s messages must be unique. Applies only to messages with more than 9 characters. Is true (1) if users must post unique messages; otherwise, false (0).
  'room-id': string; // An ID that identifies the chat room (channel).
  slow: StringNumber; // An integer value that determines how long, in seconds, users must wait between sending messages.
  'subs-only': StringBoolean; // A Boolean value that determines whether only subscribers and moderators can chat in the chat room. Is true (1) if only subscribers and moderators can chat; otherwise, false (0).
};

export type UserNoticeTags = CommonTags & {
  login: string; // The login name of the user whose action generated the message.
  'msg-id': MessageId;
  'system-msg': string; // The message Twitch shows in the chat room for this notice.
};

/**
 *
 * The type of subscription plan being used. Possible values are:
 *  Prime — Amazon Prime subscription
 *  1000 — First level of paid subscription
 *  2000 — Second level of paid subscription
 *  3000 — Third level of paid subscription
 *
 */
type SubscriptionPlan = 'Prime' | '1000' | '2000' | '3000';

export type SubscriptionNoticeTags = {
  'msg-param-cumulative-months': StringNumber; // The total number of months the user has subscribed. This is the same as msg-param-months but sent for different types of user notices.
  'msg-param-should-share-streak': StringBoolean; // A Boolean value that indicates whether the user wants their streaks shared.
  'msg-param-streak-months': StringNumber; // The number of consecutive months the user has subscribed. This is zero (0) if msg-param-should-share-streak is 0.
  'msg-param-sub-plan': SubscriptionPlan;
  'msg-param-sub-plan-name': string; // The display name of the subscription plan. This may be a default name or one created by the channel owner.
};

export type SubGiftNoticeTags = {
  'msg-param-months': StringNumber; // The total number of months the user has subscribed. This is the same as msg-param-cumulative-months but sent for different types of user notices.
  'msg-param-recipient-display-name': string; // The display name of the subscription gift recipient.
  'msg-param-recipient-id': string; // The user ID of the subscription gift recipient.
  'msg-param-recipient-user-name': string; // The user name of the subscription gift recipient.
  'msg-param-gift-months': StringNumber; // The number of months gifted as part of a single, multi-month gift.
  'msg-param-sender-login': string; // The login name of the user who gifted the subscription.
  'msg-param-sender-name': string; // The display name of the user who gifted the subscription.
};

export type RaidNoticeTags = {
  'msg-param-displayName': string; // The display name of the broadcaster raiding this channel.
  'msg-param-login': string; // The login name of the broadcaster raiding this channel.
  'msg-param-viewerCount': StringNumber; // The number of viewers raiding this channel from the broadcaster’s channel.
};

export type RitualTags = {
  'msg-param-ritual-name': 'new_chatter'; // The name of the ritual being celebrated. Possible values are: new_chatter.
};

export type Tags = Partial<
  PrivMsgTags & RoomstateTags & UserNoticeTags & SubscriptionNoticeTags & SubGiftNoticeTags & RaidNoticeTags & RitualTags & UserStateTags & NoticeTags
>;

export type ParsedMessage = {
  tags: Tags | null;
  source: Source | null;
  command: Command | null;
  parameters: string | null;
};

export type BotCommandCooldown = {
  commandId: string;
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
  description?: string;
};
