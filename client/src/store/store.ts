import { create } from 'zustand';

import type { ChatBadge, ChatEmote, SpotifySong } from '../types';

interface Store {
  reconnectAttempt: number;
  task: string;
  currentSong: SpotifySong | null;
  selectedDisplayName: string;
  chatEmotes: Record<string, ChatEmote>;
  chatBadges: Record<string, ChatBadge>;
  setTask: (task: string) => void;
  setCurrentSong: (song: SpotifySong) => void;
  resetState: () => void;
  setSelectedDisplayName: (displayName: string) => void;
  addEmotes: (emotes: Record<string, ChatEmote>) => void;
  addBadges: (badge: Record<string, ChatBadge>) => void;
}

const useStore = create<Store>((set, get) => ({
  reconnectAttempt: 0,
  task: '',
  currentSong: null,
  selectedDisplayName: '',
  chatEmotes: {},
  chatBadges: {},
  setTask: (task: string) => {
    set(() => ({ task }));
  },
  resetState: () => {
    console.log('reset state');
  },
  setCurrentSong: (song: SpotifySong) => {
    set(() => ({ currentSong: song }));
  },
  setSelectedDisplayName: (displayName: string) => {
    const newDisplayName = displayName === get().selectedDisplayName ? '' : displayName;

    set((state) => ({
      ...state,
      selectedDisplayName: newDisplayName,
    }));
  },
  addEmotes: (emotes: Record<string, ChatEmote>) => {
    set((state) => ({
      ...state,
      chatEmotes: { ...state.chatEmotes, ...emotes },
    }));
  },
  addBadges: (badges: Record<string, ChatBadge>) => {
    set((state) => ({
      ...state,
      chatBadges: { ...state.chatBadges, ...badges },
    }));
  },
}));

export default useStore;
