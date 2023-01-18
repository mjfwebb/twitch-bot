import { create } from 'zustand';


interface Store {
  reconnectAttempt: number,
  task: string,
  setTask: (task: string) => void;
  resetState: () => void;
}

const useStore = create<Store>((set, get) => ({
  reconnectAttempt: 0,
  task: '',
  setTask: (task: string) => {
    set(() => ({ task }));
  },
  resetState: () => {
    console.log('reset state');
  }
}));

export default useStore;
