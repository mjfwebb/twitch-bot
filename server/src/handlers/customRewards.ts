// https://api.twitch.tv/helix/channel_points/custom_rewards

import Config from '../config';
import { TWITCH_HELIX_URL } from '../constants';
import { fetchWithRetry, getCurrentAccessToken } from '../twitch';
import { assertArray } from '../utils/assertArray';
import { hasOwnProperty } from '../utils/hasOwnProperty';

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

let customRewards: CustomReward[];

export const getCustomRewards = () => customRewards;

export const createCustomReward = async (body: string) => {
  if (Config.twitch) {
    try {
      const url = `${TWITCH_HELIX_URL}channel_points/custom_rewards?broadcaster_id=${Config.twitch.broadcaster_id}`;
      const accessToken = getCurrentAccessToken();

      const result = await fetchWithRetry(url, {
        method: 'POST',
        headers: {
          'Client-Id': Config.twitch.client_id,
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body,
      });
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
};

export const editCustomReward = async (customRewardId: string, body: string) => {
  const customReward = customRewards.find((customReward) => customReward.id === customRewardId);

  if (!customReward) {
    throw new Error('Cannot find custom reward');
  }

  if (Config.twitch) {
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
        body,
      });
      console.dir(result, { depth: null });
      if (hasOwnProperty(result, 'data')) {
        const customRewardsData: unknown = result.data;
        assertArray(customRewardsData);
        await fetchCustomRewards();
      }
    } catch (error) {
      console.error(error);
    }
  }
};

export const fetchCustomRewards = async (): Promise<void> => {
  if (Config.twitch) {
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
  }
};
