import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { DEFAULT_CHAT_SETTINGS_VALUES } from "../constants";

interface ChatPersistedSettings {
  animatedEntry: boolean;
  backgroundColor: string;
  heightValue: number;
  heightUnit: string;
  widthValue: number;
  widthUnit: string;
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
  fontSizeValue: number;
  fontSizeUnit: string;
  fontFamily: string;
  setAnimatedEntry: (animatedEntry: boolean) => void;
  setBackgroundColor: (backgroundColor: string) => void;
  setHeightValue: (heightValue: number) => void;
  setHeightUnit: (heightUnit: string) => void;
  setWidthValue: (widthValue: number) => void;
  setWidthUnit: (widthUnit: string) => void;
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
  setFontSizeValue: (fontSizeValue: number) => void;
  setFontSizeUnit: (fontSizeUnit: string) => void;
  setFontFamily: (fontFamily: string) => void;
  resetState: () => void;
}

export const useChatSettingsStore = create(
  persist<ChatPersistedSettings>(
    (set) => ({
      animatedEntry: true,
      backgroundColor: DEFAULT_CHAT_SETTINGS_VALUES.backgroundColor,
      heightValue: DEFAULT_CHAT_SETTINGS_VALUES.heightValue,
      heightUnit: DEFAULT_CHAT_SETTINGS_VALUES.heightUnit,
      widthValue: DEFAULT_CHAT_SETTINGS_VALUES.widthValue,
      widthUnit: DEFAULT_CHAT_SETTINGS_VALUES.widthUnit,
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
      fontSizeUnit: DEFAULT_CHAT_SETTINGS_VALUES.fontSizeUnit,
      fontSizeValue: DEFAULT_CHAT_SETTINGS_VALUES.fontSizeValue,
      fontFamily: DEFAULT_CHAT_SETTINGS_VALUES.fontFamily,
      setAnimatedEntry: (animatedEntry: boolean) => {
        set(() => ({ animatedEntry }));
      },
      setBackgroundColor: (backgroundColor: string) => {
        set(() => ({ backgroundColor }));
      },
      setHeightValue: (heightValue: number) => {
        set(() => ({ heightValue }));
      },
      setHeightUnit: (heightUnit: string) => {
        set(() => ({ heightUnit }));
      },
      setWidthValue: (widthValue: number) => {
        set(() => ({ widthValue }));
      },
      setWidthUnit: (widthUnit: string) => {
        set(() => ({ widthUnit }));
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
      setFontSizeValue: (fontSizeValue: number) => {
        set(() => ({ fontSizeValue }));
      },
      setFontSizeUnit: (fontSizeUnit: string) => {
        set(() => ({ fontSizeUnit }));
      },
      setFontFamily: (fontFamily: string) => {
        set(() => ({ fontFamily }));
      },
      resetState: () => undefined,
    }),
    {
      name: "chat-settings",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
