import type { SevenTVTwitchUser } from "./types";

let sevenTVUser: SevenTVTwitchUser | null = null;

export const getSevenTVUser = () => {
  return sevenTVUser;
};

export const setSevenTVUser = (user: SevenTVTwitchUser) => {
  sevenTVUser = user;
};
