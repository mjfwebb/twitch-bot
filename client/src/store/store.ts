import { create } from 'zustand';

import type { SpotifySong } from '../types';

interface Store {
  reconnectAttempt: number;
  task: string;
  currentSong: SpotifySong | null;
  setTask: (task: string) => void;
  setCurrentSong: (song: SpotifySong) => void;
  resetState: () => void;
}

const useStore = create<Store>((set) => ({
  reconnectAttempt: 0,
  task: '',
  currentSong: null,
  setTask: (task: string) => {
    set(() => ({ task }));
  },
  resetState: () => {
    console.log('reset state');
  },
  setCurrentSong: (song: SpotifySong) => {
    set(() => ({ currentSong: song }));
  },
}));

export default useStore;
