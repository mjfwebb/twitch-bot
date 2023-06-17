export type BttvEmote = {
  id: string;
  code: string;
  imageType: string;
  animated: boolean;
  userId: string;
};

export type BttvUser = {
  id: string;
  bots: string[];
  avatar: string;
  channelEmotes: {
    id: string;
    code: string;
    imageType: string;
    animated: boolean;
    userId: string;
  }[];
  sharedEmotes: {
    id: string;
    code: string;
    imageType: string;
    animated: boolean;
    user: {
      id: string;
      name: string;
      displayName: string;
      providerId: string;
    };
  }[];
};
