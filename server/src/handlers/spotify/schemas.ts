import { z } from 'zod';

const imageSchema = z.object({
  url: z.string(),
  height: z.number(),
  width: z.number(),
});

const spotifyArtistSchema = z.object({
  external_urls: z.object({
    spotify: z.string(),
  }),
  followers: z.object({
    href: z.string(),
    total: z.number(),
  }),
  genres: z.array(z.string()),
  href: z.string(),
  id: z.string(),
  images: z.array(imageSchema),
  name: z.string(),
  popularity: z.number(),
  type: z.string(),
  uri: z.string(),
});

export const spotifyTrackSchema = z.object({
  album: z.object({
    album_type: z.string(),
    total_tracks: z.number(),
    available_markets: z.array(z.string()),
    external_urls: z.object({
      spotify: z.string(),
    }),
    href: z.string(),
    id: z.string(),
    images: z.array(imageSchema),
    name: z.string(),
    release_date: z.string(),
    release_date_precision: z.string(),
    type: z.string(),
    uri: z.string(),
    copyrights: z.tuple([
      z.object({
        text: z.string(),
        type: z.string(),
      }),
    ]),
    external_ids: z.object({
      isrc: z.string(),
      ean: z.string(),
      upc: z.string(),
    }),
    genres: z.array(z.string()),
    label: z.string(),
    popularity: z.number(),
    album_group: z.string(),
    artists: z.tuple([
      z.object({
        external_urls: z.object({
          spotify: z.string(),
        }),
        href: z.string(),
        id: z.string(),
        name: z.string(),
        type: z.literal('artist'),
        uri: z.string(),
      }),
    ]),
  }),
  artists: z.array(spotifyArtistSchema),
  available_markets: z.array(z.string()),
  disc_number: z.number(),
  duration_ms: z.number(),
  explicit: z.boolean(),
  external_ids: z.object({
    isrc: z.string(),
    ean: z.string(),
    upc: z.string(),
  }),
  external_urls: z.object({
    spotify: z.string(),
  }),
  href: z.string(),
  id: z.string(),
  is_playable: z.boolean(),
  name: z.string(),
  popularity: z.number(),
  preview_url: z.string(),
  track_number: z.number(),
  type: z.string(),
  uri: z.string(),
  is_local: z.boolean(),
});

export const spotifySongSchema = z.object({
  timestamp: z.number(),
  context: z.object({
    external_urls: z.object({
      spotify: z.string(),
    }),
    href: z.string(),
    type: z.string(),
    uri: z.string(),
  }),
  progress_ms: z.number(),
  item: spotifyTrackSchema,
  currently_playing_type: z.string(),
  actions: z.object({
    disallows: z.object({
      resuming: z.boolean(),
    }),
  }),
  is_playing: z.boolean(),
});

export const spotifyTracksSchema = z.array(spotifyTrackSchema);

export type SpotifyTrack = z.infer<typeof spotifyTrackSchema>;
export type SpotifyTracks = z.infer<typeof spotifyTracksSchema>;
export type SpotifySong = z.infer<typeof spotifySongSchema>;
