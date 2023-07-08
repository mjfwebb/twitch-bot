export type SevenTVEmote = {
  id: string;
  name: string;
  flags: number;
  timestamp: number;
  actor_id: string;
  data: {
    id: string;
    name: string;
    flags: number;
    lifecycle: number;
    state: ('PERSONAL' | 'LISTED')[];
    listed: boolean;
    animated: boolean;
    owner: {
      id: string;
      username: string;
      display_name: string;
      avatar_url: string;
      style: unknown;
      roles: string[];
    };
    host: {
      url: string;
      files: {
        name: string;
        static_name: string;
        width: number;
        height: number;
        frame_count: number;
        size: number;
        format: 'AVIF' | 'WEBP';
      }[];
    };
  };
};

export type SevenTVEmoteSet = {
  id: string;
  name: string;
  flags: number;
  tags: string[];
  immutable: boolean;
  privileged: boolean;
  emotes: SevenTVEmote[];
};

export type SevenTVUser = {
  id: string;
  username: string;
  display_name: string;
  created_at: number;
  avatar_url: string;
  style: unknown;
  emote_sets: {
    id: string;
    name: string;
    flags: number;
    tags: string[];
    capacity: number;
  }[];
  editors: {
    id: string;
    permissions: number;
    visible: boolean;
    added_at: number;
  }[];
  roles: string[];
  connections: {
    id: string;
    platform: string;
    username: string;
    display_name: string;
    linked_at: number;
    emote_capacity: number;
    emote_set_id: null;
    emote_set: {
      id: string;
      name: string;
      flags: number;
      tags: string[];
      immutable: boolean;
      privileged: boolean;
      capacity: number;
      owner: null;
    };
  }[];
};
