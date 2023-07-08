import type { ParsedMessage } from './twitchTypes';

export type SpotifySong = {
  timestamp: number;
  context: {
    external_urls: {
      spotify: string;
    };
    href: string;
    type: string;
    uri: string;
  };
  progress_ms: number;
  item: {
    album: {
      album_type: string;
      artists: [
        {
          external_urls: {
            spotify: string;
          };
          href: string;
          id: string;
          name: string;
          type: string;
          uri: string;
        }
      ];
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      images: {
        height: number;
        url: string;
        width: number;
      }[];
      name: string;
      release_date: string;
      release_date_precision: string;
      total_tracks: number;
      type: string;
      uri: string;
    };
    artists: {
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      name: string;
      type: string;
      uri: string;
    }[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: {
      isrc: string;
    };
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    is_local: boolean;
    is_playable: boolean;
    name: string;
    popularity: number;
    preview_url: string;
    track_number: number;
    type: string;
    uri: string;
  };
  currently_playing_type: string;
  actions: {
    disallows: {
      resuming: boolean;
    };
  };
  is_playing: boolean;
};

export type ChatMessage = {
  id: string;
  user: {
    userId: string;
    displayName: string;
    welcomeMessage?: string;
    points: number;
    experience: number;
    lastSeen: string;
    avatarUrl: string;
  } | null;
  parsedMessage: ParsedMessage;
};

export type ChatEmote = {
  origin: 'sevenTV' | 'betterTTV' | 'frankerFaceZ' | 'twitch';
  src: string;
  srcSet?: string;
  width: number | null;
  height: number | null;
  modifier: boolean;
  hidden: boolean;
  modifierFlags: number;
};

export type ChatBadge = {
  name: string;
  url: string;
};

export type ChatCheer = {
  name: string;
  url: string;
  color: string;
  minBits: number;
};
