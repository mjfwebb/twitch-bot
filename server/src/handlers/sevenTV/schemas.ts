import { z } from 'zod';

const sevenTVEmoteDataSetOwnerSchema = z.nullable(
  z.object({
    id: z.string(),
    username: z.string(),
    display_name: z.string(),
    avatar_url: z.optional(z.string()),
    style: z.unknown(),
    roles: z.optional(z.array(z.string())),
  }),
);

export const sevenTVEmoteDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  flags: z.number(),
  lifecycle: z.number(),
  state: z.array(z.union([z.literal('PERSONAL'), z.literal('NO_PERSONAL'), z.literal('LISTED')])),
  listed: z.boolean(),
  animated: z.boolean(),
  owner: z.optional(sevenTVEmoteDataSetOwnerSchema),
  host: z.object({
    url: z.string(),
    files: z.array(
      z.object({
        name: z.string(),
        static_name: z.string(),
        width: z.number(),
        height: z.number(),
        frame_count: z.number(),
        size: z.number(),
        format: z.union([z.literal('AVIF'), z.literal('WEBP'), z.literal('PNG'), z.literal('GIF')]),
      }),
    ),
  }),
});

export const sevenTVEmoteSchema = z.object({
  id: z.string(),
  name: z.string(),
  flags: z.number(),
  timestamp: z.number(),
  actor_id: z.nullable(z.string()),
  data: sevenTVEmoteDataSchema,
});

export const sevenTVEmoteSetSchema = z.object({
  id: z.string(),
  name: z.string(),
  flags: z.number(),
  tags: z.array(z.string()),
  immutable: z.boolean(),
  privileged: z.boolean(),
  emotes: z.array(sevenTVEmoteSchema),
});

export const sevenTVUserSchema = z.object({
  id: z.string(),
  username: z.string(),
  display_name: z.string(),
  created_at: z.number(),
  avatar_url: z.string(),
  style: z.unknown(),
  emote_sets: z.optional(
    z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        flags: z.number(),
        tags: z.array(z.string()),
        capacity: z.number(),
      }),
    ),
  ),
  editors: z.optional(
    z.array(
      z.object({
        id: z.string(),
        permissions: z.number(),
        visible: z.boolean(),
        added_at: z.number(),
      }),
    ),
  ),
  roles: z.array(z.string()),
  connections: z.array(
    z.object({
      id: z.string(),
      platform: z.string(),
      username: z.string(),
      display_name: z.string(),
      linked_at: z.number(),
      emote_capacity: z.number(),
      emote_set_id: z.nullable(z.string()),
      emote_set: z.nullable(
        z.object({
          id: z.string(),
          name: z.string(),
          flags: z.number(),
          tags: z.array(z.string()),
          immutable: z.boolean(),
          privileged: z.boolean(),
          capacity: z.number(),
          owner: sevenTVEmoteDataSetOwnerSchema,
        }),
      ),
    }),
  ),
});

export const sevenTVTwitchUserSchema = z.object({
  id: z.string(),
  platform: z.string(),
  username: z.string(),
  display_name: z.string(),
  linked_at: z.number(),
  emote_capacity: z.number(),
  emote_set_id: z.nullable(z.string()),
  emote_set: z.object({
    id: z.string(),
    name: z.string(),
    flags: z.number(),
    tags: z.array(z.string()),
    immutable: z.boolean(),
    privileged: z.boolean(),
    emotes: z.array(sevenTVEmoteSchema),
    emote_count: z.number(),
    capacity: z.number(),
    owner: sevenTVEmoteDataSetOwnerSchema,
  }),
  user: sevenTVUserSchema,
});

export type SevenTVEmoteData = z.infer<typeof sevenTVEmoteDataSchema>;
export type SevenTVEmote = z.infer<typeof sevenTVEmoteSchema>;
export type SevenTVEmoteSet = z.infer<typeof sevenTVEmoteSetSchema>;
export type SevenTVUser = z.infer<typeof sevenTVUserSchema>;
export type SevenTVTwitchUser = z.infer<typeof sevenTVTwitchUserSchema>;
