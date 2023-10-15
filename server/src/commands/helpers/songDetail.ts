import type { SpotifyTrack } from "../../handlers/spotify/types";

export const songDetails = (song: SpotifyTrack, includeLink = true) => {
  const externalLink = includeLink ? ` (${song.external_urls.spotify})` : "";
  return `${song.name} - ${song.artists
    .map((artist) => artist.name)
    .join(", ")} ${externalLink}`;
};
