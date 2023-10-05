export const TWITCH_CHAT_IRC_WS_URL = 'ws://irc-ws.chat.twitch.tv:80';
export const TWITCH_HELIX_URL = 'https://api.twitch.tv/helix/';
export const TWITCH_AUTH_URL = 'https://id.twitch.tv/oauth2/';
export const SPOTIFY_API_URL = 'https://api.spotify.com/v1/';
export const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/';
export const TWITCH_WEBSOCKET_EVENTSUB_URL = 'wss://eventsub.wss.twitch.tv/ws';
export const TWITCH_INSIGHTS_URL = 'https://api.twitchinsights.net/v1/';
export const SEVEN_TV_WEBSOCKET_URL = 'wss://events.7tv.io/v3';
export const BETTER_TTV_WEBSOCKET_URL = 'wss://sockets.betterttv.net/ws';

export const SECOND_MS = 1000;
export const MINUTE_MS = 60000;
export const MAX_TWITCH_MESSAGE_LENGTH = 500;
export const CHAT_MESSAGES_TO_RETAIN = 20;

export const SOUNDS = ['success', 'fail', 'party', 'ominous_bell', 'redeem', 'oh_great_heavens'] as const;

export const VOICES = [
  {
    name: 'Filiz',
    id: 'Filiz',
    api: 'streamelements',
  },
  {
    name: 'Astrid',
    id: 'Astrid',
    api: 'streamelements',
  },
  {
    name: 'Tatyana',
    id: 'Tatyana',
    api: 'streamelements',
  },
  {
    name: 'Maxim',
    id: 'Maxim',
    api: 'streamelements',
  },
  {
    name: 'Carmen',
    id: 'Carmen',
    api: 'streamelements',
  },
  {
    name: 'Ines',
    id: 'Ines',
    api: 'streamelements',
  },
  {
    name: 'Cristiano',
    id: 'Cristiano',
    api: 'streamelements',
  },
  {
    name: 'Vitoria',
    id: 'Vitoria',
    api: 'streamelements',
  },
  {
    name: 'Ricardo',
    id: 'Ricardo',
    api: 'streamelements',
  },
  {
    name: 'Maja',
    id: 'Maja',
    api: 'streamelements',
  },
  {
    name: 'Jan',
    id: 'Jan',
    api: 'streamelements',
  },
  {
    name: 'Jacek',
    id: 'Jacek',
    api: 'streamelements',
  },
  {
    name: 'Ewa',
    id: 'Ewa',
    api: 'streamelements',
  },
  {
    name: 'Ruben',
    id: 'Ruben',
    api: 'streamelements',
  },
  {
    name: 'Lotte',
    id: 'Lotte',
    api: 'streamelements',
  },
  {
    name: 'Liv',
    id: 'Liv',
    api: 'streamelements',
  },
  {
    name: 'Seoyeon',
    id: 'Seoyeon',
    api: 'streamelements',
  },
  {
    name: 'Takumi',
    id: 'Takumi',
    api: 'streamelements',
  },
  {
    name: 'Mizuki',
    id: 'Mizuki',
    api: 'streamelements',
  },
  {
    name: 'Giorgio',
    id: 'Giorgio',
    api: 'streamelements',
  },
  {
    name: 'Carla',
    id: 'Carla',
    api: 'streamelements',
  },
  {
    name: 'Bianca',
    id: 'Bianca',
    api: 'streamelements',
  },
  {
    name: 'Karl',
    id: 'Karl',
    api: 'streamelements',
  },
  {
    name: 'Dora',
    id: 'Dora',
    api: 'streamelements',
  },
  {
    name: 'Mathieu',
    id: 'Mathieu',
    api: 'streamelements',
  },
  {
    name: 'Celine',
    id: 'Celine',
    api: 'streamelements',
  },
  {
    name: 'Chantal',
    id: 'Chantal',
    api: 'streamelements',
  },
  {
    name: 'Penelope',
    id: 'Penelope',
    api: 'streamelements',
  },
  {
    name: 'Miguel',
    id: 'Miguel',
    api: 'streamelements',
  },
  {
    name: 'Mia',
    id: 'Mia',
    api: 'streamelements',
  },
  {
    name: 'Enrique',
    id: 'Enrique',
    api: 'streamelements',
  },
  {
    name: 'Conchita',
    id: 'Conchita',
    api: 'streamelements',
  },
  {
    name: 'Geraint',
    id: 'Geraint',
    api: 'streamelements',
  },
  {
    name: 'Salli',
    id: 'Salli',
    api: 'streamelements',
  },
  {
    name: 'Matthew',
    id: 'Matthew',
    api: 'streamelements',
  },
  {
    name: 'Kimberly',
    id: 'Kimberly',
    api: 'streamelements',
  },
  {
    name: 'Kendra',
    id: 'Kendra',
    api: 'streamelements',
  },
  {
    name: 'Justin',
    id: 'Justin',
    api: 'streamelements',
  },
  {
    name: 'Joey',
    id: 'Joey',
    api: 'streamelements',
  },
  {
    name: 'Joanna',
    id: 'Joanna',
    api: 'streamelements',
  },
  {
    name: 'Ivy',
    id: 'Ivy',
    api: 'streamelements',
  },
  {
    name: 'Raveena',
    id: 'Raveena',
    api: 'streamelements',
  },
  {
    name: 'Aditi',
    id: 'Aditi',
    api: 'streamelements',
  },
  {
    name: 'Emma',
    id: 'Emma',
    api: 'streamelements',
  },
  {
    name: 'Brian',
    id: 'Brian',
    api: 'streamelements',
  },
  {
    name: 'Amy',
    id: 'Amy',
    api: 'streamelements',
  },
  {
    name: 'Russell',
    id: 'Russell',
    api: 'streamelements',
  },
  {
    name: 'Nicole',
    id: 'Nicole',
    api: 'streamelements',
  },
  {
    name: 'Vicki',
    id: 'Vicki',
    api: 'streamelements',
  },
  {
    name: 'Marlene',
    id: 'Marlene',
    api: 'streamelements',
  },
  {
    name: 'Hans',
    id: 'Hans',
    api: 'streamelements',
  },
  {
    name: 'Naja',
    id: 'Naja',
    api: 'streamelements',
  },
  {
    name: 'Mads',
    id: 'Mads',
    api: 'streamelements',
  },
  {
    name: 'Gwyneth',
    id: 'Gwyneth',
    api: 'streamelements',
  },
  {
    name: 'Zhiyu',
    id: 'Zhiyu',
    api: 'streamelements',
  },
  {
    name: 'Tracy',
    id: 'Tracy',
    api: 'streamelements',
  },
  {
    name: 'Danny',
    id: 'Danny',
    api: 'streamelements',
  },
  {
    name: 'Huihui',
    id: 'Huihui',
    api: 'streamelements',
  },
  {
    name: 'Yaoyao',
    id: 'Yaoyao',
    api: 'streamelements',
  },
  {
    name: 'Kangkang',
    id: 'Kangkang',
    api: 'streamelements',
  },
  {
    name: 'HanHan',
    id: 'HanHan',
    api: 'streamelements',
  },
  {
    name: 'Zhiwei',
    id: 'Zhiwei',
    api: 'streamelements',
  },
  {
    name: 'Asaf',
    id: 'Asaf',
    api: 'streamelements',
  },
  {
    name: 'An',
    id: 'An',
    api: 'streamelements',
  },
  {
    name: 'Stefanos',
    id: 'Stefanos',
    api: 'streamelements',
  },
  {
    name: 'Filip',
    id: 'Filip',
    api: 'streamelements',
  },
  {
    name: 'Ivan',
    id: 'Ivan',
    api: 'streamelements',
  },
  {
    name: 'Heidi',
    id: 'Heidi',
    api: 'streamelements',
  },
  {
    name: 'Herena',
    id: 'Herena',
    api: 'streamelements',
  },
  {
    name: 'Kalpana',
    id: 'Kalpana',
    api: 'streamelements',
  },
  {
    name: 'Hemant',
    id: 'Hemant',
    api: 'streamelements',
  },
  {
    name: 'Matej',
    id: 'Matej',
    api: 'streamelements',
  },
  {
    name: 'Andika',
    id: 'Andika',
    api: 'streamelements',
  },
  {
    name: 'Rizwan',
    id: 'Rizwan',
    api: 'streamelements',
  },
  {
    name: 'Lado',
    id: 'Lado',
    api: 'streamelements',
  },
  {
    name: 'Valluvar',
    id: 'Valluvar',
    api: 'streamelements',
  },
  {
    name: 'Linda',
    id: 'Linda',
    api: 'streamelements',
  },
  {
    name: 'Heather',
    id: 'Heather',
    api: 'streamelements',
  },
  {
    name: 'Sean',
    id: 'Sean',
    api: 'streamelements',
  },
  {
    name: 'Michael',
    id: 'Michael',
    api: 'streamelements',
  },
  {
    name: 'Karsten',
    id: 'Karsten',
    api: 'streamelements',
  },
  {
    name: 'Guillaume',
    id: 'Guillaume',
    api: 'streamelements',
  },
  {
    name: 'Pattara',
    id: 'Pattara',
    api: 'streamelements',
  },
  {
    name: 'Jakub',
    id: 'Jakub',
    api: 'streamelements',
  },
  {
    name: 'Szabolcs',
    id: 'Szabolcs',
    api: 'streamelements',
  },
  {
    name: 'Hoda',
    id: 'Hoda',
    api: 'streamelements',
  },
  {
    name: 'Naayf',
    id: 'Naayf',
    api: 'streamelements',
  },
  {
    name: 'sing',
    id: 'en_male_m03_lobby',
    api: 'tiktok',
  },
  {
    name: 'sing2',
    id: 'en_female_f08_salut_damour',
    api: 'tiktok',
  },
  {
    name: 'sing3',
    id: 'en_female_f08_warmy_breeze',
    api: 'tiktok',
  },
  {
    name: 'sing4',
    id: 'en_male_m03_sunshine_soon',
    api: 'tiktok',
  },
  {
    name: 'old',
    id: 'en_male_narration',
    api: 'tiktok',
  },
  {
    name: 'chewbacca',
    id: 'en_us_chewbacca',
    api: 'tiktok',
  },
  {
    name: 'c3',
    id: 'en_us_c3po',
    api: 'tiktok',
  },
  {
    name: 'stitch',
    id: 'en_us_stitch',
    api: 'tiktok',
  },
  {
    name: 'rocket',
    id: 'en_us_rocket',
    api: 'tiktok',
  },
  {
    name: 'Betty',
    id: 'en_female_betty',
    api: 'tiktok',
  },
  {
    name: 'ukneighbor',
    id: 'en_male_ukneighbor',
    api: 'tiktok',
  },
  {
    name: 'ukbutler',
    id: 'en_male_ukbutler',
    api: 'tiktok',
  },
  {
    name: 'jp5',
    id: 'jp_005',
    api: 'tiktok',
  },
  {
    name: 'us1',
    id: 'en_us_001',
    api: 'tiktok',
  },
];
