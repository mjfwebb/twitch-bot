/* eslint-disable max-len */
// https://api.twitch.tv/helix/channel_points/custom_rewards

import Config from '../../../config';
import { TWITCH_HELIX_URL } from '../../../constants';
import { fetchWithRetry, getCurrentAccessToken } from '../../../twitch';
import { assertArray } from '../../../utils/assertArray';
import { hasOwnProperty } from '../../../utils/hasOwnProperty';

interface CustomReward {
  broadcaster_name: string;
  broadcaster_login: string;
  broadcaster_id: string;
  id: string;
  image: string;
  background_color: string;
  is_enabled: boolean;
  cost: number;
  title: string;
  prompt: string;
  is_user_input_required: boolean;
  is_paused: boolean;
  is_in_stock: boolean;
  should_redemptions_skip_request_queue: boolean;
  redemptions_redeemed_current_stream: null;
  cooldown_expires_at: null;
}

type NewCustomReward = {
  title?: string; //	The custom reward’s title. The title may contain a maximum of 45 characters and it must be unique amongst all of the broadcaster’s custom rewards.
  cost?: number; // The cost of the reward, in Channel Points. The minimum is 1 point.
  prompt?: string; // The prompt shown to the viewer when they redeem the reward. Specify a prompt if is_user_input_required is true. The prompt is limited to a maximum of 200 characters.
  is_enabled?: boolean; // A Boolean value that determines whether the reward is enabled. Viewers see only enabled rewards. The default is true.
  background_color?: string; // The background color to use for the reward. Specify the color using Hex format (for example, #9147FF).
  is_user_input_required?: boolean; // A Boolean value that determines whether the user needs to enter information when redeeming the reward. See the prompt field. The default is false.
  is_max_per_stream_enabled?: boolean; // A Boolean value that determines whether to limit the maximum number of redemptions allowed per live stream (see the max_per_stream field). The default is false.
  max_per_stream?: number; // The maximum number of redemptions allowed per live stream. Applied only if is_max_per_stream_enabled is true. The minimum value is 1.
  is_max_per_user_per_stream_enabled?: boolean; // A Boolean value that determines whether to limit the maximum number of redemptions allowed per user per stream (see the max_per_user_per_stream field). The default is false.
  max_per_user_per_stream?: number; // The maximum number of redemptions allowed per user per stream. Applied only if is_max_per_user_per_stream_enabled is true. The minimum value is 1.
  is_global_cooldown_enabled?: boolean; // A Boolean value that determines whether to apply a cooldown period between redemptions (see the global_cooldown_seconds field for the duration of the cooldown period). The default is false.
  global_cooldown_seconds?: number; // The cooldown period, in seconds. Applied only if the is_global_cooldown_enabled field is true. The minimum value is 1; however, the minimum value is 60 for it to be shown in the Twitch UX.
  should_redemptions_skip_request_queue?: boolean; // A Boolean value that determines whether redemptions should be set to FULFILLED status immediately when a reward is redeemed. If false, status is set to UNFULFILLED and follows the normal request queue process. The default is false.
};

let customRewards: CustomReward[];

export const getCustomRewards = () => customRewards;

export const createCustomReward = async (newReward: NewCustomReward): Promise<void> => {
  try {
    const url = `${TWITCH_HELIX_URL}channel_points/custom_rewards?broadcaster_id=${Config.twitch.broadcaster_id}`;
    const accessToken = getCurrentAccessToken();

    await fetchWithRetry(url, {
      method: 'POST',
      headers: {
        'Client-Id': Config.twitch.client_id,
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newReward),
    });
  } catch (error) {
    console.error(error);
  }
};

export const editCustomReward = async (customRewardId: string, reward: NewCustomReward) => {
  const customReward = customRewards.find((customReward) => customReward.id === customRewardId);

  if (!customReward) {
    throw new Error('Cannot find custom reward');
  }

  try {
    const url = `${TWITCH_HELIX_URL}channel_points/custom_rewards?broadcaster_id=${Config.twitch.broadcaster_id}&id=${customRewardId}`;
    const accessToken = getCurrentAccessToken();

    const result = await fetchWithRetry(url, {
      method: 'PATCH',
      headers: {
        'Client-Id': Config.twitch.client_id,
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reward),
    });
    if (hasOwnProperty(result, 'data')) {
      const customRewardsData: unknown = result.data;
      assertArray(customRewardsData);
      await fetchCustomRewards();
    }
  } catch (error) {
    console.error(error);
  }
};

export const fetchCustomRewards = async (): Promise<void> => {
  try {
    const url = `${TWITCH_HELIX_URL}channel_points/custom_rewards?broadcaster_id=${Config.twitch.broadcaster_id}`;
    const accessToken = getCurrentAccessToken();

    const result = await fetchWithRetry(url, {
      method: 'GET',
      headers: {
        'Client-Id': Config.twitch.client_id,
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (hasOwnProperty(result, 'data')) {
      const customRewardsData: unknown = result.data;
      assertArray(customRewardsData);
      customRewards = customRewardsData as CustomReward[];
    }
  } catch (error) {
    console.error(error);
  }
};
