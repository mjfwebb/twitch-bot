import Config from './config';
import { fetchBetterTTVUser } from './handlers/bttv/fetchBetterTTVUser';
import { fetchSevenTVEmoteSet } from './handlers/sevenTV/fetchSevenTVEmoteSets';
import { fetchSevenTVUser } from './handlers/sevenTV/fetchSevenTVUser';
import { getIO } from './runSocketServer';

export type ChatEmote = {
  url: string;
  width: number | null;
  height: number | null;
};

const sevenTVEmotesForClient: Record<string, ChatEmote> = {};
const betterTTVEmotesForClient: Record<string, ChatEmote> = {};

export const loadEmotes = async () => {
  await loadSevenTVEmotes();
  await loadBetterTTVEmotes();

  // Change the order of this destructuring for your preferered emote prioritisation
  getIO().emit('emotes', { ...betterTTVEmotesForClient, ...sevenTVEmotesForClient });
};

export const loadSevenTVEmotes = async () => {
  if (Config.sevenTV) {
    const sevenTVUser = await fetchSevenTVUser();
    if (sevenTVUser) {
      const emoteSets = [sevenTVUser.emote_sets[0].id, 'global'];
      for (const emoteSet of emoteSets) {
        const sevenTVEmoteSet = await fetchSevenTVEmoteSet(emoteSet);
        if (sevenTVEmoteSet) {
          sevenTVEmoteSet.emotes.forEach((emote) => {
            const name = emote.name;
            // Use the last in the array of files as it will be the largest WebP
            const file = emote.data.host.files[emote.data.host.files.length - 1];
            const imageUrl = `${emote.data.host.url}/${file.name}`;

            sevenTVEmotesForClient[name] = {
              url: imageUrl,
              width: file.width,
              height: file.height,
            };
          });
        }
      }
    }
  }
};

const loadBetterTTVEmotes = async () => {
  if (Config.betterTTV) {
    const betterTTVUser = await fetchBetterTTVUser();
    if (betterTTVUser) {
      betterTTVUser.sharedEmotes.forEach((emote) => {
        const name = emote.code;
        const imageUrl = `https://cdn.betterttv.net/emote/${emote.id}/3x.${emote.imageType}`;

        betterTTVEmotesForClient[name] = {
          url: imageUrl,
          width: null,
          height: null,
        };
      });
    }
  }
};
