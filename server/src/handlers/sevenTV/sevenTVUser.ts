import type { SevenTVUser } from './types';

let sevenTVUser: SevenTVUser | null = null;

export const getSevenTVUser = () => {
  return sevenTVUser;
};

export const setSevenTVUser = (user: SevenTVUser) => {
  sevenTVUser = user;
};
