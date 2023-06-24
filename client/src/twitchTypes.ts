/* eslint-disable max-len */
export type Command = {
  command: string;
  channel: string;
  isCapRequestEnabled?: boolean;
  botCommand: string;
  botCommandParams: string;
};

export type Source = {
  nick: string | null;
  host: string | null;
};

export type Emotes = {
  [key: string]: {
    startPosition: number;
    endPosition: number;
  }[];
};

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
export type Badges = {
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
  tags: Tags;
  source: Source;
  command: Command;
  parameters: string;
};

export type CommandWithBotCommandParams = Omit<Command, 'botCommandParams'> & { botCommandParams: string };

export type TaskMessage = {
  tags: Tags;
  source: Source;
  command: CommandWithBotCommandParams;
  parameters: string;
};
