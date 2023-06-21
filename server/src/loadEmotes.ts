import Config from './config';
import { fetchBetterTTVGlobalEmotes } from './handlers/bttv/fetchBetterTTVGlobalEmotes';
import { fetchBetterTTVUser } from './handlers/bttv/fetchBetterTTVUser';
import { fetchFrankerFaceZGlobalEmotes } from './handlers/frankerfacez/fetchFrankerFaceZGlobalEmotes';
import { fetchFrankerFaceZRoomEmotes } from './handlers/frankerfacez/fetchFrankerFaceZRoomEmotes';
import { fetchSevenTVEmoteSet } from './handlers/sevenTV/fetchSevenTVEmoteSets';
import { fetchSevenTVUser } from './handlers/sevenTV/fetchSevenTVUser';
import { getIO } from './runSocketServer';

export type ChatEmote = {
  origin: 'sevenTV' | 'betterTTV' | 'frankerFaceZ' | 'twitch';
  src: string;
  srcSet?: string;
  width: number | null;
  height: number | null;
  modifier: boolean;
  hidden: boolean;
  modifierFlags: number;
};

const sevenTVEmotesForClient: Record<string, ChatEmote> = {};
const betterTTVEmotesForClient: Record<string, ChatEmote> = {};
const frankerFaceZEmotesForClient: Record<string, ChatEmote> = {};

export const loadEmotes = async () => {
  await loadSevenTVEmotes();
  await loadSevenTVGlobalEmotes();
  await loadBetterTTVEmotes();
  await loadBetterTTVGlobalEmotes();
  await loadFrankerFaceZRoomEmotes();
  await loadFrankerFaceZGlobalEmotes();

  // Change the order of this destructuring for your preferered emote prioritisation
  getIO().emit('emotes', { ...frankerFaceZEmotesForClient, ...betterTTVEmotesForClient, ...sevenTVEmotesForClient });
};

const loadFrankerFaceZGlobalEmotes = async () => {
  if (Config.frankerFaceZ.enabled) {
    const frankerFaceZGlobalEmotes = await fetchFrankerFaceZGlobalEmotes();
    if (frankerFaceZGlobalEmotes) {
      const emoteSets = frankerFaceZGlobalEmotes.default_sets;
      for (const emoteSet of emoteSets) {
        const frankerFaceZEmoteSet = frankerFaceZGlobalEmotes.sets[emoteSet];
        if (frankerFaceZEmoteSet) {
          for (const emote of Object.values(frankerFaceZEmoteSet.emoticons)) {
            const name = emote.name;
            const imageUrl = emote.urls['1'];

            frankerFaceZEmotesForClient[name] = {
              origin: 'frankerFaceZ',
              src: imageUrl,
              width: emote.width,
              height: emote.height,
              modifier: emote.modifier,
              hidden: emote.hidden,
              modifierFlags: emote.modifier_flags,
            };
          }
        }
      }
    }
  }
};

const loadFrankerFaceZRoomEmotes = async () => {
  if (Config.frankerFaceZ.enabled) {
    const frankerFaceZGlobalEmotes = await fetchFrankerFaceZRoomEmotes();
    if (frankerFaceZGlobalEmotes) {
      const emoteSets = frankerFaceZGlobalEmotes.sets;
      for (const emoteSet of Object.values(emoteSets)) {
        for (const emote of Object.values(emoteSet.emoticons)) {
          const name = emote.name;
          const imageUrl = emote.urls['1'];

          frankerFaceZEmotesForClient[name] = {
            origin: 'frankerFaceZ',
            src: imageUrl,
            width: emote.width,
            height: emote.height,
            modifier: emote.modifier,
            hidden: emote.hidden,
            modifierFlags: emote.modifier_flags,
          };
        }
      }
    }
  }
};

const loadSevenTVEmotes = async () => {
  if (Config.sevenTV.enabled) {
    const sevenTVUser = await fetchSevenTVUser();
    if (sevenTVUser) {
      const emoteSets = [sevenTVUser.emote_sets[0].id, 'global'];
      for (const emoteSet of emoteSets) {
        const sevenTVEmoteSet = await fetchSevenTVEmoteSet(emoteSet);
        if (sevenTVEmoteSet) {
          sevenTVEmoteSet.emotes.forEach((emote) => {
            const name = emote.name;
            // Use the second in the array of files as it will be the smallest WebP
            const file = emote.data.host.files[2];
            const imageUrl = `${emote.data.host.url}/${file.name}`;

            sevenTVEmotesForClient[name] = {
              origin: 'sevenTV',
              src: imageUrl,
              width: file.width,
              height: file.height,
              modifier: false,
              hidden: false,
              modifierFlags: emote.data.flags,
            };
          });
        }
      }
    }
  }
};

const loadSevenTVGlobalEmotes = async () => {
  if (Config.sevenTV.enabled) {
    const sevenTVEmoteSet = await fetchSevenTVEmoteSet('global');
    if (sevenTVEmoteSet) {
      sevenTVEmoteSet.emotes.forEach((emote) => {
        const name = emote.name;
        // Use the second in the array of files as it will be the smallest WebP
        const file = emote.data.host.files[2];
        const imageUrl = `${emote.data.host.url}/${file.name}`;

        sevenTVEmotesForClient[name] = {
          origin: 'sevenTV',
          src: imageUrl,
          width: file.width,
          height: file.height,
          modifier: false,
          hidden: false,
          modifierFlags: emote.data.flags,
        };
      });
    }
  }
};

const loadBetterTTVEmotes = async () => {
  if (Config.betterTTV.enabled) {
    const betterTTVUser = await fetchBetterTTVUser();
    if (betterTTVUser) {
      betterTTVUser.sharedEmotes.forEach((emote) => {
        const name = emote.code;
        const imageUrl = `https://cdn.betterttv.net/emote/${emote.id}/1x.${emote.imageType}`;

        betterTTVEmotesForClient[name] = {
          origin: 'betterTTV',
          src: imageUrl,
          width: null,
          height: null,
          modifier: false,
          hidden: false,
          modifierFlags: 0,
        };
      });
    }
  }
};

export const loadBetterTTVGlobalEmotes = async () => {
  const betterTTVGlobalEmotes = await fetchBetterTTVGlobalEmotes();
  if (betterTTVGlobalEmotes) {
    betterTTVGlobalEmotes.forEach((emote) => {
      const name = emote.code;

      betterTTVEmotesForClient[name] = {
        origin: 'betterTTV',
        src: `https://cdn.betterttv.net/emote/${emote.id}/1x.${emote.imageType}`,
        width: null,
        height: null,
        modifier: false,
        hidden: false,
        modifierFlags: 0,
      };
    });
  }
};
