import Config from "../config";
import { fetchBetterTTVGlobalEmotes } from "../handlers/bttv/fetchBetterTTVGlobalEmotes";
import { fetchBetterTTVUser } from "../handlers/bttv/fetchBetterTTVUser";
import type { BttvEmote } from "../handlers/bttv/types";
import { fetchFrankerFaceZGlobalEmotes } from "../handlers/frankerfacez/fetchFrankerFaceZGlobalEmotes";
import { fetchFrankerFaceZRoomEmotes } from "../handlers/frankerfacez/fetchFrankerFaceZRoomEmotes";
import type { FrankerFaceZEmote } from "../handlers/frankerfacez/types";
import { fetchSevenTVEmote } from "../handlers/sevenTV/fetchSevenTVEmote";
import { fetchSevenTVEmoteSet } from "../handlers/sevenTV/fetchSevenTVEmoteSets";
import { getSevenTVUser } from "../handlers/sevenTV/sevenTVUser";
import type { SevenTVEmote } from "../handlers/sevenTV/types";
import { logger } from "../logger";
import { getIO } from "../runSocketServer";

export type ChatEmote = {
  origin: "sevenTV" | "betterTTV" | "frankerFaceZ" | "twitch";
  src: string;
  srcSet?: string;
  width: number | null;
  height: number | null;
  modifier: boolean;
  hidden: boolean;
  modifierFlags: number;
  id: string;
  name: string;
};

const sevenTVEmotesForClient: Record<string, ChatEmote> = {};
const betterTTVEmotesForClient: Record<string, ChatEmote> = {};
const frankerFaceZEmotesForClient: Record<string, ChatEmote> = {};

export function sendEmotes() {
  // Change the order of this destructuring for your preferered emote prioritisation
  getIO().emit("emotes", {
    ...frankerFaceZEmotesForClient,
    ...betterTTVEmotesForClient,
    ...sevenTVEmotesForClient,
  });
}

export const loadEmotes = async () => {
  await loadSevenTVEmotes();
  await loadBetterTTVUserEmotes();
  await loadBetterTTVGlobalEmotes();
  await loadFrankerFaceZRoomEmotes();
  await loadFrankerFaceZGlobalEmotes();

  sendEmotes();
};

export const addFrankerFaceZEmote = (emote: FrankerFaceZEmote) => {
  const name = emote.name;
  const imageUrl = emote.urls["1"];

  frankerFaceZEmotesForClient[name] = {
    origin: "frankerFaceZ",
    src: imageUrl,
    width: emote.width,
    height: emote.height,
    modifier: emote.modifier,
    hidden: emote.hidden,
    modifierFlags: emote.modifier_flags,
    id: String(emote.id),
    name,
  };
};

const loadFrankerFaceZGlobalEmotes = async () => {
  if (Config.frankerFaceZ.enabled) {
    const frankerFaceZGlobalEmotes = await fetchFrankerFaceZGlobalEmotes();
    if (frankerFaceZGlobalEmotes) {
      const emoteSets = frankerFaceZGlobalEmotes.default_sets;
      for (const emoteSet of emoteSets) {
        const frankerFaceZEmoteSet = frankerFaceZGlobalEmotes.sets[emoteSet];
        if (frankerFaceZEmoteSet) {
          Object.values(frankerFaceZEmoteSet.emoticons).forEach((emote) =>
            addFrankerFaceZEmote(emote),
          );
        }
      }
    }
  }
};

const loadFrankerFaceZRoomEmotes = async () => {
  if (Config.frankerFaceZ.enabled) {
    const frankerFaceZRoomEmotes = await fetchFrankerFaceZRoomEmotes();
    if (frankerFaceZRoomEmotes) {
      const emoteSets = frankerFaceZRoomEmotes.sets;
      for (const emoteSet of Object.values(emoteSets)) {
        Object.values(emoteSet.emoticons).forEach((emote) =>
          addFrankerFaceZEmote(emote),
        );
      }
    }
  }
};

export const removeSevenTVEmote = (emoteId: string) => {
  const foundEmote = Object.values(sevenTVEmotesForClient).find(
    (emote) => emote.id === emoteId,
  );
  if (!foundEmote) return;

  delete sevenTVEmotesForClient[foundEmote.name];

  sendEmotes();
};

export const addSevenTVEmote = async (emote: SevenTVEmote) => {
  const name = emote.name;
  // Use the second in the array of files as it will be the smallest WebP
  const file = emote.data.host.files[2];

  if (file) {
    const imageUrl = `${emote.data.host.url}/${file.name}`;

    sevenTVEmotesForClient[name] = {
      origin: "sevenTV",
      src: imageUrl,
      width: file.width,
      height: file.height,
      modifier: false,
      hidden: false,
      modifierFlags: emote.data.flags,
      id: emote.id,
      name,
    };
  } else {
    const id = emote.id;

    const emoteData = await fetchSevenTVEmote(id);
    if (!emoteData) {
      logger.error(`Failed to fetch SevenTV emote ${id}`);
      return;
    }
    const file = emoteData.host.files[2];
    const imageUrl = `${emoteData.host.url}/${file.name}`;

    sevenTVEmotesForClient[emoteData.name] = {
      origin: "sevenTV",
      src: imageUrl,
      width: file.width,
      height: file.height,
      modifier: false,
      hidden: false,
      modifierFlags: emoteData.flags,
      id: emoteData.id,
      name,
    };
  }

  sendEmotes();
};

const loadSevenTVEmotes = async () => {
  if (Config.sevenTV.enabled) {
    const sevenTVUser = getSevenTVUser();
    if (sevenTVUser) {
      const emoteSets = [sevenTVUser.emote_set.id, "global"];
      for (const emoteSet of emoteSets) {
        const sevenTVEmoteSet = await fetchSevenTVEmoteSet(emoteSet);
        if (sevenTVEmoteSet) {
          for (const emote of sevenTVEmoteSet.emotes) {
            await addSevenTVEmote(emote);
          }
        }
      }
    }
  }
};

export const removeBetterTTVEmote = (emoteId: string) => {
  const foundEmote = Object.values(betterTTVEmotesForClient).find(
    (emote) => emote.id === emoteId,
  );
  if (!foundEmote) return;

  delete betterTTVEmotesForClient[foundEmote.name];

  sendEmotes();
};

export const addBetterTTVEmote = (
  emote: Pick<BttvEmote, "code" | "id" | "imageType">,
) => {
  betterTTVEmotesForClient[emote.code] = {
    origin: "betterTTV",
    src: `https://cdn.betterttv.net/emote/${emote.id}/2x.${emote.imageType}`,
    width: null,
    height: null,
    modifier: false,
    hidden: false,
    modifierFlags: 0,
    id: emote.id,
    name: emote.code,
  };

  sendEmotes();
};

const loadBetterTTVUserEmotes = async () => {
  if (Config.betterTTV.enabled) {
    const betterTTVUser = await fetchBetterTTVUser();
    if (betterTTVUser) {
      betterTTVUser.sharedEmotes.forEach((emote) => addBetterTTVEmote(emote));
    }
  }
};

const loadBetterTTVGlobalEmotes = async () => {
  const betterTTVGlobalEmotes = await fetchBetterTTVGlobalEmotes();
  if (betterTTVGlobalEmotes) {
    betterTTVGlobalEmotes.forEach((emote) => addBetterTTVEmote(emote));
  }
};
