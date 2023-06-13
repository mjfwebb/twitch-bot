import { persist } from 'zustand/middleware';
import { create } from 'zustand';

import type { ChatMessage } from '../types';

interface PersistentState {
  chatMessages: ChatMessage[];
  purgeOlderMessages: (amountToKeep: number) => void;
  addChatMessage: (chatMessage: ChatMessage) => void;
}

export const usePersistentStore = create<PersistentState>()(
  persist(
    (set, get) => ({
      chatMessages: [],
      purgeOlderMessages: (amountToKeep: number) => {
        set((state) => ({
          ...state,
          chatMessages: get().chatMessages.slice(get().chatMessages.length - amountToKeep, get().chatMessages.length),
        }));
      },
      addChatMessage: (chatMessage: ChatMessage) => {
        set((state) => ({
          ...state,
          chatMessages: [...state.chatMessages, chatMessage],
        }));
      },
    }),
    {
      name: 'twitch-bot',
    }
  )
);
