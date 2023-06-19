// https://api.frankerfacez.com/v1/set/global

import Config from '../../config';
import { hasOwnProperty } from '../../utils/hasOwnProperty';

type FrankerFaceZGlobalEmotes = {
  default_sets: number[];
  sets: {
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
};

export const fetchFrankerFaceZGlobalEmotes = async (): Promise<FrankerFaceZGlobalEmotes | null> => {
  if (Config.frankerFaceZ.enabled) {
    try {
      const url = `https://api.frankerfacez.com/v1/set/global`;
      const response = await fetch(url, { method: 'GET' });
      const data: unknown = await response.json();

      if (hasOwnProperty(data, 'default_sets') && hasOwnProperty(data, 'sets')) {
        return data as FrankerFaceZGlobalEmotes;
      }
    } catch (error) {
      console.error(error);
    }
  }

  return null;
};
