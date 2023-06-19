export type FrankerFaceZEmoteSets = {
  [key: string]: {
    id: number;
    title: string;
    emoticons: {
      [key: string]: {
        id: number;
        height: number;
        width: number;
        hidden: boolean;
        modifier: boolean;
        modifier_flags: number;
        name: string;
        urls: {
          [key: string]: string;
        };
      };
    };
  };
};
