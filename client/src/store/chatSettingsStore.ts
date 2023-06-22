import { createJSONStorage, persist } from 'zustand/middleware';
import { create } from 'zustand';

import { DEFAULT_CHAT_SETTINGS_VALUES } from '../constants';

interface ChatPersistedSettings {
  animatedEntry: boolean;
  backgroundColor: string;
  height: string;
  width: string;
  disappears: boolean;
  disappearsTime: number;
  dropShadow: boolean;
  dropShadowColor: string;
  foregroundColor: string;
  showAvatars: boolean;
  showBorders: boolean;
  setAnimatedEntry: (animatedEntry: boolean) => void;
  setBackgroundColor: (backgroundColor: string) => void;
  setHeight: (height: string) => void;
  setWidth: (width: string) => void;
  setDisappears: (disappears: boolean) => void;
  setDisappearsTime: (disappearsTime: number) => void;
  setDropShadow: (dropShadow: boolean) => void;
  setDropShadowColor: (dropShadowColor: string) => void;
  setForegroundColor: (foregroundColor: string) => void;
  setShowAvatars: (showAvatars: boolean) => void;
  setShowBorders: (showBorders: boolean) => void;
  resetState: () => void;
}

export const useChatSettingsStore = create(
  persist<ChatPersistedSettings>(
    (set, get) => ({
      animatedEntry: true,
      backgroundColor: DEFAULT_CHAT_SETTINGS_VALUES.backgroundColor,
      height: DEFAULT_CHAT_SETTINGS_VALUES.height,
      width: DEFAULT_CHAT_SETTINGS_VALUES.width,
      disappears: false,
      disappearsTime: DEFAULT_CHAT_SETTINGS_VALUES.disappearsTime,
      dropShadow: false,
      dropShadowColor: DEFAULT_CHAT_SETTINGS_VALUES.dropShadowColor,
      foregroundColor: DEFAULT_CHAT_SETTINGS_VALUES.foregroundColor,
      showAvatars: true,
      showBorders: true,
      setAnimatedEntry: (animatedEntry: boolean) => {
        set(() => ({ animatedEntry }));
      },
      setBackgroundColor: (backgroundColor: string) => {
        set(() => ({ backgroundColor }));
      },
      setHeight: (height: string) => {
        set(() => ({ height }));
      },
      setWidth: (width: string) => {
        set(() => ({ width }));
      },
      setDisappears: (disappears: boolean) => {
        set(() => ({ disappears }));
      },
      setDisappearsTime: (disappearsTime: number) => {
        set(() => ({ disappearsTime }));
      },
      setDropShadow: (dropShadow: boolean) => {
        set(() => ({ dropShadow }));
      },
      setDropShadowColor: (dropShadowColor: string) => {
        set(() => ({ dropShadowColor }));
      },
      setForegroundColor: (foregroundColor: string) => {
        set(() => ({ foregroundColor }));
      },
      setShowAvatars: (showAvatars: boolean) => {
        set(() => ({ showAvatars }));
      },
      setShowBorders: (showBorders: boolean) => {
        set(() => ({ showBorders }));
      },
      resetState: () => undefined,
    }),
    {
      name: 'chat-settings',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
