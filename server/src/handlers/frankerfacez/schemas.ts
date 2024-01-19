import { z } from 'zod';

export const frankerFaceZEmoteSchema = z.object({
  id: z.number(),
  height: z.number(),
  width: z.number(),
  hidden: z.boolean(),
  modifier: z.boolean(),
  modifier_flags: z.number(),
  name: z.string(),
  urls: z.record(z.string()),
});

export const frankerFaceZEmoteSetsSchema = z.optional(z.record(
  z.object({
    id: z.number(),
    title: z.string(),
    emoticons: z.optional(z.array(frankerFaceZEmoteSchema)),
  }),
));

export const frankerFaceZGlobalEmotesSchema = z.object({
  default_sets: z.array(z.number()),
  sets: frankerFaceZEmoteSetsSchema,
});

export const frankerFaceZRoomEmotesSchema = z.object({
  sets: frankerFaceZEmoteSetsSchema,
});

export type FrankerFaceZEmote = z.infer<typeof frankerFaceZEmoteSchema>;
export type FrankerFaceZEmoteSets = z.infer<typeof frankerFaceZEmoteSetsSchema>;
export type FrankerFaceZGlobalEmotes = z.infer<typeof frankerFaceZGlobalEmotesSchema>;
export type FrankerFaceZRoomEmotes = z.infer<typeof frankerFaceZRoomEmotesSchema>;
