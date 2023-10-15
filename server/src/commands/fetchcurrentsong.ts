import { fetchCurrentlyPlaying } from "../handlers/spotify/fetchCurrentlyPlaying";
import type { BotCommand } from "../types";

export const fetchcurrentsong: BotCommand = {
  command: "fetchcurrentsong",
  id: "fetchcurrentsong",
  hidden: true,
  description: "Gets the currently playing song (on Spotify)",
  callback: async () => {
    await fetchCurrentlyPlaying();
  },
};
