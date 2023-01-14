export const TWITCH_HELIX_URL = 'https://api.twitch.tv/helix/';
export const TWITCH_AUTH_URL = 'https://id.twitch.tv/oauth2/';
export const TWITCH_WEBSOCKET_EVENTSUB_URL = 'wss://eventsub-beta.wss.twitch.tv/ws';

export const SECOND_MS = 1000;
export const MINUTE_MS = 60000;

export const SOUNDS = ['success', 'fail', 'party', 'ominous_bell', 'redeem', 'oh_great_heavens'] as const;

export const REWARDS = {
  pushup: 'd17e63c6-208f-4275-bcd7-6a558cc5a494',
  pushupAddOne: '0279c574-da62-4a22-acf1-e2e97523ea10',
  test: '634ddd00-d1a9-482c-b7c5-8693cdb591eb',
};

export const VOICES = {
  brian: {
    id: 'Brian',
    api: 'kappa',
  },
  sing: {
    id: 'en_male_m03_lobby',
    api: 'tiktok',
  },
  sing2: {
    id: 'en_female_f08_salut_damour',
    api: 'tiktok',
  },
  sing3: {
    id: 'en_female_f08_warmy_breeze',
    api: 'tiktok',
  },
  sing4: {
    id: 'en_male_m03_sunshine_soon',
    api: 'tiktok',
  },
  old: {
    id: 'en_male_narration',
    api: 'tiktok',
  },
  chewbacca: {
    id: 'en_us_chewbacca',
    api: 'tiktok',
  },
  c3: {
    id: 'en_us_c3po',
    api: 'tiktok',
  },
  stitch: {
    id: 'en_us_stitch',
    api: 'tiktok',
  },
  rocket: {
    id: 'en_us_rocket',
    api: 'tiktok',
  },
};
