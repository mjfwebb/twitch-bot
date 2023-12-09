import type { SevenTVTwitchUser } from './schemas';

let sevenTVUser: SevenTVTwitchUser | null = null;

export const getSevenTVUser = () => {
  return sevenTVUser;
};

export const setSevenTVUser = (user: SevenTVTwitchUser) => {
  sevenTVUser = user;
};
