export const TWITCH_CHAT_IRC_WS_URL = 'ws://irc-ws.chat.twitch.tv:80';
export const TWITCH_HELIX_URL = 'https://api.twitch.tv/helix/';
export const TWITCH_AUTH_URL = 'https://id.twitch.tv/oauth2/';
export const SPOTIFY_API_URL = 'https://api.spotify.com/v1/';
export const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/api/';
export const TWITCH_WEBSOCKET_EVENTSUB_URL = 'wss://eventsub.wss.twitch.tv/ws';
export const TWITCH_INSIGHTS_URL = 'https://api.twitchinsights.net/v1/';
export const SEVEN_TV_WEBSOCKET_URL = 'wss://events.7tv.io/v3';
export const BETTER_TTV_WEBSOCKET_URL = 'wss://sockets.betterttv.net/ws';

export const SECOND_MS = 1000;
export const MINUTE_MS = 60000;
export const MAX_TWITCH_MESSAGE_LENGTH = 500;

export const SOUNDS = ['success', 'fail', 'party', 'ominous_bell', 'redeem', 'oh_great_heavens'] as const;

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
