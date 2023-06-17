import { create } from 'zustand';

import type { ChatBadge, ChatEmote, ChatMessage, SpotifySong } from '../types';
import type { TaskMessage } from '../twitchTypes';

interface Store {
  reconnectAttempt: number;
  task: TaskMessage | null;
  currentSong: SpotifySong | null;
  selectedDisplayName: string;
  chatEmotes: Record<string, ChatEmote>;
  chatBadges: Record<string, ChatBadge>;
  chatMessages: ChatMessage[];
  setTask: (task: TaskMessage) => void;
  setCurrentSong: (song: SpotifySong) => void;
  resetState: () => void;
  setSelectedDisplayName: (displayName: string) => void;
  addEmotes: (emotes: Record<string, ChatEmote>) => void;
  addBadges: (badge: Record<string, ChatBadge>) => void;
  addChatMessage: (chatMessage: ChatMessage) => void;
  addChatMessages: (chatMessages: ChatMessage[]) => void;
}

const useStore = create<Store>((set, get) => ({
  reconnectAttempt: 0,
  task: null,
  currentSong: null,
  selectedDisplayName: '',
  chatEmotes: {},
  chatBadges: {},
  chatMessages: [],
  setTask: (task: TaskMessage) => {
    set(() => ({ task }));
  },
  resetState: () => undefined,
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
  addChatMessage: (chatMessage: ChatMessage) => {
    const searchParams = new URLSearchParams(window.location.search);
    const disappears = searchParams.get('disappears') === 'true' ? true : false;
    if (disappears) {
      const disappearsTime = searchParams.get('disappears-time') !== null ? Number(searchParams.get('disappears-time')) : 10;
      const now = Date.now();
      const filteredChatMessages = [...get().chatMessages, chatMessage].filter((chatMessage) => {
        const messageTime = new Date(Number(chatMessage.parsedMessage.tags['tmi-sent-ts'])).getTime();
        const disappearsTimeSeconds = disappearsTime * 1000;
        const differenceBetweenMessageAndNow = now - messageTime;
        const isDisappeared = disappearsTimeSeconds < differenceBetweenMessageAndNow;
        return !isDisappeared;
      });
      set((state) => ({
        ...state,
        chatMessages: filteredChatMessages,
      }));
    } else {
      set((state) => ({
        ...state,
        chatMessages: [...state.chatMessages, chatMessage],
      }));
    }
  },
  addChatMessages: (chatMessages: ChatMessage[]) => {
    set((state) => ({
      ...state,
      chatMessages,
    }));
  },
}));

export default useStore;
