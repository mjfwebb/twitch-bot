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
  | ChannelPointsCustomRewardRedemptionEvent;

export type EventsubEventBase<EventType extends EventsubSubscriptionType> = {
  eventType: EventType;
};

export type EventsubSubscriptionType =
  // | 'channel.update'
  | 'channel.follow'
  | 'channel.subscribe'
  // | 'channel.subscription.end'
  | 'channel.subscription.gift'
  // | 'channel.subscription.message'
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
  | 'stream.offline';
// | 'user.authorization.grant'
// | 'user.authorization.revoke'
// | 'user.update';

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
