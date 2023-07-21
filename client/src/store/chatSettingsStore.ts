import { createJSONStorage, persist } from 'zustand/middleware';
import { create } from 'zustand';

import { DEFAULT_CHAT_SETTINGS_VALUES } from '../constants';

interface ChatPersistedSettings {
  animatedEntry: boolean;
  backgroundColor: string;
  height: string;
  width: string;
  animatedExit: boolean;
  secondsBeforeExit: number;
  dropShadowEnabled: boolean;
  dropShadowSettings: string;
  foregroundColor: string;
  showAvatars: boolean;
  showBorders: boolean;
  showColonAfterDisplayName: boolean;
  textStrokeEnabled: boolean;
  textStrokeSettings: string;
  setAnimatedEntry: (animatedEntry: boolean) => void;
  setBackgroundColor: (backgroundColor: string) => void;
  setHeight: (height: string) => void;
  setWidth: (width: string) => void;
  setAnimatedExit: (disappears: boolean) => void;
  setSecondsBeforeExit: (secondsBeforeExit: number) => void;
  setDropShadowEnabled: (dropShadowEnabled: boolean) => void;
  setDropShadowSettings: (dropShadowSettings: string) => void;
  setForegroundColor: (foregroundColor: string) => void;
  setShowAvatars: (showAvatars: boolean) => void;
  setShowBorders: (showBorders: boolean) => void;
  setShowColonAfterDisplayName: (showColonAfterDisplayName: boolean) => void;
  setTextStrokeEnabled: (textStrokeEnabled: boolean) => void;
  setTextStrokeSettings: (textStrokeSettings: string) => void;
  resetState: () => void;
}

export const useChatSettingsStore = create(
  persist<ChatPersistedSettings>(
    (set, get) => ({
      animatedEntry: true,
      backgroundColor: DEFAULT_CHAT_SETTINGS_VALUES.backgroundColor,
      height: DEFAULT_CHAT_SETTINGS_VALUES.height,
      width: DEFAULT_CHAT_SETTINGS_VALUES.width,
      animatedExit: false,
      secondsBeforeExit: DEFAULT_CHAT_SETTINGS_VALUES.secondsBeforeExit,
      dropShadowEnabled: false,
      dropShadowSettings: DEFAULT_CHAT_SETTINGS_VALUES.dropShadowSettings,
      foregroundColor: DEFAULT_CHAT_SETTINGS_VALUES.foregroundColor,
      textStrokeEnabled: false,
      textStrokeSettings: DEFAULT_CHAT_SETTINGS_VALUES.textStrokeSettings,
      showAvatars: true,
      showBorders: true,
      showColonAfterDisplayName: false,
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
      setAnimatedExit: (animatedExit: boolean) => {
        set(() => ({ animatedExit }));
      },
      setSecondsBeforeExit: (secondsBeforeExit: number) => {
        set(() => ({ secondsBeforeExit }));
      },
      setDropShadowEnabled: (dropShadowEnabled: boolean) => {
        set(() => ({ dropShadowEnabled }));
      },
      setDropShadowSettings: (dropShadowSettings: string) => {
        set(() => ({ dropShadowSettings }));
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
      setShowColonAfterDisplayName: (showColonAfterDisplayName: boolean) => {
        set(() => ({ showColonAfterDisplayName }));
      },
      setTextStrokeEnabled: (textStrokeEnabled: boolean) => {
        set(() => ({ textStrokeEnabled }));
      },
      setTextStrokeSettings: (textStrokeSettings: string) => {
        set(() => ({ textStrokeSettings }));
      },
      resetState: () => undefined,
    }),
    {
      name: 'chat-settings',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
