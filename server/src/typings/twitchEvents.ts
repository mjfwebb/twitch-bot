/* eslint-disable max-len */

export type EventSubCondition = { [key: string]: string };

export type EventSubResponse = {
  subscription: {
    type: EventsubSubscriptionType;
  };
  event: Record<string, unknown>;
};

export type EventsubEvent =
  | ChannelSubscribeEvent
  | StreamOnlineEvent
  | StreamOfflineEvent
  | ChannelSubscriptionGiftEvent
  | ChannelRaidEvent
  | ChannelFollowEvent
  | ChannelPointsCustomRewardRedemptionEvent
  | ChannelSubscribeMessageEvent
  | ChannelChatMessageEvent
  | ChannelChatMessageDeleteEvent
  | ChannelChatNotificationEvent;

export type EventsubEventBase<EventType extends EventsubSubscriptionType> = {
  eventType: EventType;
};

export type EventsubSubscriptionType =
  // | 'channel.update'
  | 'channel.follow'
  | 'channel.subscribe'
  // | 'channel.subscription.end'
  | 'channel.subscription.gift'
  | 'channel.subscription.message'
  // | 'channel.cheer'
  | 'channel.raid'
  // | 'channel.ban'
  // | 'channel.unban'
  // | 'channel.moderator.add'
  // | 'channel.moderator.remove'
  // | 'channel.channel_points_custom_reward.add'
  // | 'channel.channel_points_custom_reward.update'
  // | 'channel.channel_points_custom_reward.remove'
  | 'channel.channel_points_custom_reward_redemption.add'
  | 'channel.channel_points_custom_reward_redemption.update'
  // | 'channel.poll.begin'
  // | 'channel.poll.progress'
  // | 'channel.poll.end'
  // | 'channel.prediction.begin'
  // | 'channel.prediction.progress'
  // | 'channel.prediction.lock'
  // | 'channel.prediction.end'
  // | 'channel.charity_campaign.donate'
  // | 'channel.charity_campaign.start'
  // | 'channel.charity_campaign.progress'
  // | 'channel.charity_campaign.stop'
  // | 'drop.entitlement.grant'
  // | 'extension.bits_transaction.create'
  // | 'channel.goal.begin'
  // | 'channel.goal.progress'
  // | 'channel.goal.end'
  // | 'channel.hype_train.begin'
  // | 'channel.hype_train.progress'
  // | 'channel.hype_train.end'
  // | 'channel.shield_mode.begin'
  // | 'channel.shield_mode.end'
  | 'stream.online'
  | 'stream.offline'
  // | 'user.authorization.grant'
  // | 'user.authorization.revoke'
  // | 'user.update'
  | 'channel.chat.message'
  | 'channel.chat.message_delete'
  | 'channel.chat.notification';

type EmotePlacement = {
  begin: number; //	The index of where the Emote starts in the text.
  end: number; //	The index of where the Emote ends in the text.
  id: string; //	The emote ID.
};

interface ChannelSubscribeMessageEvent extends EventsubEventBase<'channel.subscription.message'> {
  user_id: string; //	The user ID of the user who sent a resubscription chat message.
  user_login: string; //	The user login of the user who sent a resubscription chat message.
  user_name: string; //	The user display name of the user who a resubscription chat message.
  broadcaster_user_id: string; //	The broadcaster user ID.
  broadcaster_user_login: string; //	The broadcaster login.
  broadcaster_user_name: string; //	The broadcaster display name.
  tier: string; //	The tier of the user’s subscription.
  message: {
    text: string;
    emotes: EmotePlacement[];
  }; //	An object that contains the resubscription message and emote information needed to recreate the message.
  cumulative_months: number; //	The total number of months the user has been subscribed to the channel.
  streak_months: number; //	The number of consecutive months the user’s current subscription has been active. This value is null if the user has opted out of sharing this information.
  duration_months: number; //	The month duration of the subscription.
}

interface ChannelSubscribeEvent extends EventsubEventBase<'channel.subscribe'> {
  user_id: string; // The user ID for the user who subscribed to the specified channel.
  user_login: string; // The user login for the user who subscribed to the specified channel.
  user_name: string; // The user display name for the user who subscribed to the specified channel.
  broadcaster_user_id: string; // The requested broadcaster ID.
  broadcaster_user_login: string; // The requested broadcaster login.
  broadcaster_user_name: string; // The requested broadcaster display name.
  tier: string; // The tier of the subscription. Valid values are 1000, 2000, and 3000.
  is_gift: boolean; // Whether the subscription is a gift.
}

interface StreamOnlineEvent extends EventsubEventBase<'stream.online'> {
  id: string; // The id of the stream.
  broadcaster_user_id: string; // The broadcaster’s user id.
  broadcaster_user_login: string; // The broadcaster’s user login.
  broadcaster_user_name: string; // The broadcaster’s user display name.
  type: string; // The stream type. Valid values are: live, playlist, watch_party, premiere, rerun.
  started_at: string; // The timestamp at which the stream went online at.
}

interface StreamOfflineEvent extends EventsubEventBase<'stream.offline'> {
  broadcaster_user_id: string; // The broadcaster’s user id.
  broadcaster_user_login: string; // The broadcaster’s user login.
  broadcaster_user_name: string; // The broadcaster’s user display name.
}

interface ChannelSubscriptionGiftEvent extends EventsubEventBase<'channel.subscription.gift'> {
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
}

interface ChannelRaidEvent extends EventsubEventBase<'channel.raid'> {
  from_broadcaster_user_id: string; // The broadcaster ID that created the raid.
  from_broadcaster_user_login: string; // The broadcaster login that created the raid.
  from_broadcaster_user_name: string; // The broadcaster display name that created the raid.
  to_broadcaster_user_id: string; // The broadcaster ID that received the raid.
  to_broadcaster_user_login: string; // The broadcaster login that received the raid.
  to_broadcaster_user_name: string; // The broadcaster display name that received the raid.
  viewers: number; //The number of viewers in the raid.
}

interface ChannelFollowEvent extends EventsubEventBase<'channel.follow'> {
  user_id: string; // The user ID for the user now following the specified channel.
  user_login: string; // The user login for the user now following the specified channel.
  user_name: string; // The user display name for the user now following the specified channel.
  broadcaster_user_id: string; // The requested broadcaster ID.
  broadcaster_user_login: string; // The requested broadcaster login.
  broadcaster_user_name: string; // The requested broadcaster display name.
  // followed_at: string; // RFC3339 timestamp of when the follow occurred.
}

interface ChannelPointsCustomRewardRedemptionEvent
  extends EventsubEventBase<'channel.channel_points_custom_reward_redemption.add' | 'channel.channel_points_custom_reward_redemption.update'> {
  user_id: string; // User ID of the user that redeemed the reward.
  user_login: string; // Login of the user that redeemed the reward.
  user_name: string; // Display name of the user that redeemed the reward.
  user_input: string; // The user input provided. Empty string if not provided.
  status: 'unknown' | 'unfulfilled' | 'fulfilled' | 'canceled'; // Defaults to unfulfilled. Possible values are unknown, unfulfilled, fulfilled, and canceled.
  reward: ChannelPointsCustomReward; // Basic information about the reward that was redeemed, at the time it was redeemed.
  redeemed_at: string; // RFC3339 timestamp of when the reward was redeemed.
}

interface ChannelPointsCustomReward {
  id: string; // The reward identifier.
  title: string; // The reward name.
  cost: number; // The reward cost.
  prompt: string; // The reward description.
}

interface Cheermote {
  prefix: string; // The name portion of the Cheermote string that you use in chat to cheer Bits. The full Cheermote string is the concatenation of {prefix} + {number of Bits}. For example, if the prefix is “Cheer” and you want to cheer 100 Bits, the full Cheermote string is Cheer100. When the Cheermote string is entered in chat, Twitch converts it to the image associated with the Bits tier that was cheered.
  bits: number; // The amount of bits cheered.
  tier: number; // The tier level of the cheermote.
}

interface Emote {
  id: string; // An ID that uniquely identifies this emote.
  emote_set_id: string; // An ID that identifies the emote set that the emote belongs to.
  owner_id: string; // The ID of the broadcaster who owns the emote.
  format: 'animated' | 'static'; // The formats that the emote is available in. For example, if the emote is available only as a static PNG, the array contains only static. But if the emote is available as a static PNG and an animated GIF, the array contains static and animated. The possible formats are: animated - An animated GIF is available for this emote. static - A static PNG file is available for this emote.
}

interface Mention {
  user_id: string; // The user ID of the mentioned user.
  user_name: string; // The user name of the mentioned user.
  user_login: string; // The user login of the mentioned user.
}

interface ChatMessageFragment {
  type: 'text' | 'cheermote' | 'emote' | 'mention'; // The type of message fragment.
  text: string; // Message text in fragment.
  cheermote?: Cheermote; // Metadata pertaining to the cheermote.
  emote?: Emote; // Metadata pertaining to the emote.
  mention?: Mention; // Metadata pertaining to the mention.
}

interface Cheer {
  bits: number; // The amount of Bits used.
  total_bits: number; // The total number of Bits used in the channel by the user.
  message: string; // The message sent with the cheer.
}

interface ChatBadge {
  set_id: string; // An ID that identifies this set of chat badges. For example, Bits or Subscriber.
  version: string; // An ID that identifies this version of the badge. The ID can be any value. For example, for Bits, the ID is the Bits tier level, but for World of Warcraft, it could be Alliance or Horde.
  info: string; // Contains metadata related to the chat badges in the badges tag. Currently, this tag contains metadata only for subscriber badges, to indicate the number of months the user has been a subscriber.
}

interface ChatMessageReply {
  parent_message_id: string; // An ID that uniquely identifies the parent message that this message is replying to.
  parent_message_body: string; // The message body of the parent message.
  parent_user_id: string; // User ID of the sender of the parent message.
  parent_user_name: string; // User name of the sender of the parent message.
  parent_user_login: string; // User login of the sender of the parent message.
  thread_message_id: string; // An ID that identifies the parent message of the reply thread.
  thread_user_id: string; // User ID of the sender of the thread’s parent message.
  thread_user_name: string; // User name of the sender of the thread’s parent message.
  thread_user_login: string; // User login of the sender of the thread’s parent message.
}

interface ChatMessage {
  text: string; // The chat message in plain text.
  fragments: ChatMessageFragment[]; // Ordered list of chat message fragments.
}

interface ChannelChatMessageEvent extends EventsubEventBase<'channel.chat.message'> {
  broadcaster_user_id: string; // The broadcaster user ID.
  broadcaster_user_name: string; // The broadcaster display name.
  broadcaster_user_login: string; // The broadcaster login.
  chatter_user_id: string; // The user ID of the user that sent the message.
  chatter_user_name: string; // The user name of the user that sent the message.
  chatter_user_login: string; // The user login of the user that sent the message.
  message_id: string; // A UUID that identifies the message.
  message: ChatMessage; // The structured chat message.
  message_type: 'text' | 'channel_points_highlighted' | 'channel_points_sub_only' | 'user_intro'; // The type of message.
  badges: ChatBadge[]; // List of chat badges.
  cheer?: Cheer; // Metadata if this message is a cheer.
  color: string; // The color of the user’s name in the chat room.
  reply?: ChatMessageReply; // Metadata if this message is a reply.
  channel_points_custom_reward_id?: string; // The ID of a channel points custom reward that was redeemed.
}

interface ChannelChatMessageDeleteEvent extends EventsubEventBase<'channel.chat.message_delete'> {
  broadcaster_user_id: string; // The broadcaster user ID.
  broadcaster_user_name: string; // The broadcaster display name.
  broadcaster_user_login: string; // The broadcaster login.
  target_user_id: string; // The ID of the user whose message was deleted.
  target_user_name: string; // The user name of the user whose message was deleted.
  target_user_login: string; // The user login of the user whose message was deleted.
  message_id: string; // A UUID that identifies the message that was removed.
}

interface ChannelChatNoticeSubscription {
  sub_tier: '1000' | '2000' | '3000'; // The type of subscription plan being used. Possible values are: 1000 - First level of paid or Prime subscription. 2000 - Second level of paid subscription. 3000 - Third level of paid subscription.
  is_prime: boolean; // Indicates if the subscription was obtained through Amazon Prime.
  duration_months: number; // The number of months the subscription is for.
}

interface ChannelChatNoticeResubscription {
  cumulative_months: number; // The total number of months the user has subscribed.
  duration_months: number; // The number of months the subscription is for.
  streak_months: number; // The total number of months the user has subscribed.
  sub_tier: '1000' | '2000' | '3000'; // The type of subscription plan being used. Possible values are: 1000 - First level of paid or Prime subscription. 2000 - Second level of paid subscription. 3000 - Third level of paid subscription.
  is_prime: boolean; // Indicates if the subscription was obtained through Amazon Prime.
  is_gift: boolean; // Whether or not the resub was a result of a gift.
  gifter_is_anonymous: boolean; // Whether or not the gift was anonymous.
  gifter_user_id: string; // The user ID of the subscription gifter. Null if anonymous.
  gifter_user_name: string; // The user name of the subscription gifter. Null if anonymous.
  gifter_user_login: string; // The user login of the subscription gifter. Null if anonymous.
}

interface ChannelChatNoticeSubscriptionGift {
  duration_months: number; // The number of months the subscription is for.
  cumulative_total: number; // The amount of gifts the gifter has given in this channel. Null if anonymous.
  recipient_user_id: string; // The user ID of the subscription gift recipient.
  recipient_user_name: string; // The user name of the subscription gift recipient.
  recipient_user_login: string; // The user login of the subscription gift recipient.
  sub_tier: string; // The type of subscription plan being used. Possible values are: 1000 - First level of paid or Prime subscription. 2000 - Second level of paid subscription. 3000 - Third level of paid subscription.
  community_gift_id: string; // The ID of the associated community gift. Null if not associated with a community gift.
}

interface ChannelChatNoticeSubscriptionCommunityGift {
  id: string; // The ID of the associated community gift.
  total: number; // Number of subscriptions being gifted.
  sub_tier: string; // The type of subscription plan being used. Possible values are: 1000 - First level of paid or Prime subscription. 2000 - Second level of paid subscription. 3000 - Third level of paid subscription.
  cumulative_total: number; // The amount of gifts the gifter has given in this channel. Null if anonymous.
}

interface ChannelChatNoticeGiftPaidUpgrade {
  gifter_is_anonymous: boolean; // Whether the gift was given anonymously.
  gifter_user_id: string; // The user ID of the user who gifted the subscription. Null if anonymous.
  gifter_user_name: string; // The user name of the user who gifted the subscription. Null if anonymous.
  gifter_user_login: string; // The user login of the user who gifted the subscription. Null if anonymous.
}

interface ChannelChatNoticePrimePaidUpgrade {
  sub_tier: string; // The type of subscription plan being used. Possible values are: 1000 - First level of paid or Prime subscription. 2000 - Second level of paid subscription. 3000 - Third level of paid subscription.
}

interface ChannelChatNoticeRaid {
  user_id: string; // The user ID of the broadcaster raiding this channel.
  user_name: string; // The user name of the broadcaster raiding this channel.
  user_login: string; // The login name of the broadcaster raiding this channel.
  viewer_count: number; // The number of viewers raiding this channel from the broadcaster’s channel.
  profile_image_url: string; // Profile image URL of the broadcaster raiding this channel.
}

interface ChannelChatNoticePayItForward {
  gifter_is_anonymous: boolean; // Whether the gift was given anonymously.
  gifter_user_id: string; // The user ID of the user who gifted the subscription. Null if anonymous.
  gifter_user_name: string; // The user name of the user who gifted the subscription. Null if anonymous.
  gifter_user_login: string; // The user login of the user who gifted the subscription. Null if anonymous.
}

interface ChannelChatNoticeAnnouncement {
  color: string; // Color of the announcement.
}

interface ChannelChatNoticeCharityDonation {
  charity_name: string; // Name of the charity.
  amount: {
    value: number; // The monetary amount. The amount is specified in the currency’s minor unit. For example, the minor units for USD is cents, so if the amount is $5.50 USD, value is set to 550.
    decimal_place: number; // The number of decimal places used by the currency. For example, USD uses two decimal places.
    currency: string; // The ISO-4217 three-letter currency code that identifies the type of currency in value.
  };
}

interface ChannelChatNoticeBitsBadgeTier {
  tier: number; // The tier of the Bits badge the user just earned. For example, 100, 1000, or 10000.
}

interface ChannelChatNotificationEvent extends EventsubEventBase<'channel.chat.notification'> {
  broadcaster_user_id: string; // The broadcaster user ID.
  broadcaster_user_name: string; // The broadcaster display name.
  broadcaster_user_login: string; // The broadcaster login.
  chatter_user_id: string; // The user ID of the user that sent the message.
  chatter_user_name: string; // The user name of the user that sent the message.
  chatter_user_login: string; // The user login of the user that sent the message.
  chatter_is_anonymous: boolean; // Whether or not the chatter is anonymous.
  color: string; // The color of the user’s name in the chat room.
  badges: ChatBadge[]; // List of chat badges.
  system_message: string; // The message Twitch shows in the chat room for this notice.
  message_id: string; // A UUID that identifies the message.
  message: ChatMessage; // The structured chat message.
  notice_type:
    | 'sub'
    | 'resub'
    | 'sub_gift'
    | 'community_sub_gift'
    | 'gift_paid_upgrade'
    | 'prime_paid_upgrade'
    | 'raid'
    | 'unraid'
    | 'pay_it_forward'
    | 'announcement'
    | 'bits_badge_tier'
    | 'charity_donation'; // The type of notice.
  sub?: ChannelChatNoticeSubscription; // Information about the sub event. Null if notice_type is not sub.
  resub?: ChannelChatNoticeResubscription; // Information about the resub event. Null if notice_type is not resub.
  sub_gift?: ChannelChatNoticeSubscriptionGift; // Information about the gift sub event. Null if notice_type is not sub_gift.
  community_sub_gift?: ChannelChatNoticeSubscriptionCommunityGift; // Information about the community gift sub event. Null if notice_type is not community_sub_gift.
  gift_paid_upgrade?: ChannelChatNoticeGiftPaidUpgrade; // Information about the community gift paid upgrade event. Null if notice_type is not gift_paid_upgrade.
  prime_paid_upgrade?: ChannelChatNoticePrimePaidUpgrade; // Information about the Prime gift paid upgrade event. Null if notice_type is not prime_paid_upgrade.
  raid?: ChannelChatNoticeRaid; // Information about the raid event. Null if notice_type is not raid.
  unraid?: Record<string, never>; // Returns an empty payload if notice_type is unraid, otherwise returns null.
  pay_it_forward?: ChannelChatNoticePayItForward; // Information about the pay it forward event. Null if notice_type is not pay_it_forward.
  announcement?: ChannelChatNoticeAnnouncement; // Information about the announcement event. Null if notice_type is not announcement.
  charity_donation?: ChannelChatNoticeCharityDonation; // Information about the charity donation event. Null if notice_type is not charity_donation.
  bits_badge_tier?: ChannelChatNoticeBitsBadgeTier; // Information about the bits badge tier event. Null if notice_type is not bits_badge_tier.
}
