import { z } from 'zod';

export const bttvEmoteSchema = z.object({
  id: z.string(),
  code: z.string(),
  imageType: z.string(),
  animated: z.boolean(),
  userId: z.string(),
});

export const bttvEmotesSchema = z.array(bttvEmoteSchema);

export const bttvUserSchema = z.object({
  id: z.string(),
  bots: z.array(z.string()),
  avatar: z.string(),
  channelEmotes: z.array(
    z.object({
      id: z.string(),
      code: z.string(),
      imageType: z.string(),
      animated: z.boolean(),
      userId: z.string(),
    }),
  ),
  sharedEmotes: z.array(
    z.object({
      id: z.string(),
      code: z.string(),
      imageType: z.string(),
      animated: z.boolean(),
      user: z.object({
        id: z.string(),
        name: z.string(),
        displayName: z.string(),
        providerId: z.string(),
      }),
    }),
  ),
});

export type BttvEmote = z.infer<typeof bttvEmoteSchema>;
export type BttvEmotes = z.infer<typeof bttvEmoteSchema>;
export type BttvUser = z.infer<typeof bttvUserSchema>;
