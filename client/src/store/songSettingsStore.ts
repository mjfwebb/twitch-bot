import { createJSONStorage, persist } from 'zustand/middleware';
import { create } from 'zustand';

import { DEFAULT_SONG_SETTINGS_VALUES } from '../constants';

// Overlay height
// Overlay width
// Song title - Font size
// Song artists - Font size
// Text order: Song title before song artists, or vice versa
// Show / Hide song art
// Padding around song art
// Scrolling song titles/artists when names are too long (like a marquee)

interface SongPersistedSettings {
  primaryColor: string;
  secondaryColor: string;
  heightValue: number;
  heightUnit: string;
  widthValue: number;
  widthUnit: string;
  dropShadowEnabled: boolean;
  dropShadowSettings: string;
  textStrokeEnabled: boolean;
  textStrokeSettings: string;
  titleFontSizeValue: number;
  titleFontSizeUnit: string;
  titleFontFamily: string;
  artistsFontSizeValue: number;
  artistsFontSizeUnit: string;
  artistsFontFamily: string;
  showAlbumArt: boolean;
  setPrimaryColor: (primaryColor: string) => void;
  setSecondaryColor: (secondaryColor: string) => void;
  setHeightValue: (heightValue: number) => void;
  setHeightUnit: (heightUnit: string) => void;
  setWidthValue: (widthValue: number) => void;
  setWidthUnit: (widthUnit: string) => void;
  setDropShadowEnabled: (dropShadowEnabled: boolean) => void;
  setDropShadowSettings: (dropShadowSettings: string) => void;
  setTextStrokeEnabled: (textStrokeEnabled: boolean) => void;
  setTextStrokeSettings: (textStrokeSettings: string) => void;
  setTitleFontSizeValue: (titleFontSizeValue: number) => void;
  setTitleFontSizeUnit: (titleFontSizeUnit: string) => void;
  setTitleFontFamily: (fontFamily: string) => void;
  setArtistsFontSizeValue: (artistsFontSizeValue: number) => void;
  setArtistsFontSizeUnit: (artistsFontSizeUnit: string) => void;
  setArtistsFontFamily: (fontFamily: string) => void;
  setShowAlbumArt: (showAlbumArt: boolean) => void;
  resetState: () => void;
}

export const useSongSettingsStore = create(
  persist<SongPersistedSettings>(
    (set, get) => ({
      primaryColor: DEFAULT_SONG_SETTINGS_VALUES.primaryColor,
      secondaryColor: DEFAULT_SONG_SETTINGS_VALUES.secondaryColor,
      heightValue: DEFAULT_SONG_SETTINGS_VALUES.heightValue,
      heightUnit: DEFAULT_SONG_SETTINGS_VALUES.heightUnit,
      widthValue: DEFAULT_SONG_SETTINGS_VALUES.widthValue,
      widthUnit: DEFAULT_SONG_SETTINGS_VALUES.widthUnit,
      dropShadowEnabled: false,
      dropShadowSettings: DEFAULT_SONG_SETTINGS_VALUES.dropShadowSettings,
      textStrokeEnabled: false,
      textStrokeSettings: DEFAULT_SONG_SETTINGS_VALUES.textStrokeSettings,
      titleFontSizeUnit: DEFAULT_SONG_SETTINGS_VALUES.titleFontSizeUnit,
      titleFontSizeValue: DEFAULT_SONG_SETTINGS_VALUES.titleFontSizeValue,
      titleFontFamily: DEFAULT_SONG_SETTINGS_VALUES.titleFontFamily,
      artistsFontSizeUnit: DEFAULT_SONG_SETTINGS_VALUES.artistsFontSizeUnit,
      artistsFontSizeValue: DEFAULT_SONG_SETTINGS_VALUES.artistsFontSizeValue,
      artistsFontFamily: DEFAULT_SONG_SETTINGS_VALUES.artistsFontFamily,
      showAlbumArt: DEFAULT_SONG_SETTINGS_VALUES.showAlbumArt,
      setPrimaryColor: (primaryColor: string) => {
        set(() => ({ primaryColor }));
      },
      setSecondaryColor: (secondaryColor: string) => {
        set(() => ({ secondaryColor }));
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
      setDropShadowEnabled: (dropShadowEnabled: boolean) => {
        set(() => ({ dropShadowEnabled }));
      },
      setDropShadowSettings: (dropShadowSettings: string) => {
        set(() => ({ dropShadowSettings }));
      },
      setTextStrokeEnabled: (textStrokeEnabled: boolean) => {
        set(() => ({ textStrokeEnabled }));
      },
      setTextStrokeSettings: (textStrokeSettings: string) => {
        set(() => ({ textStrokeSettings }));
      },
      setTitleFontSizeValue: (titleFontSizeValue: number) => {
        set(() => ({ titleFontSizeValue }));
      },
      setTitleFontSizeUnit: (titleFontSizeUnit: string) => {
        set(() => ({ titleFontSizeUnit }));
      },
      setTitleFontFamily: (titleFontFamily: string) => {
        set(() => ({ titleFontFamily }));
      },
      setArtistsFontSizeValue: (artistsFontSizeValue: number) => {
        set(() => ({ artistsFontSizeValue }));
      },
      setArtistsFontSizeUnit: (artistsFontSizeUnit: string) => {
        set(() => ({ artistsFontSizeUnit }));
      },
      setArtistsFontFamily: (artistsFontFamily: string) => {
        set(() => ({ artistsFontFamily }));
      },
      setShowAlbumArt: (showAlbumArt: boolean) => {
        set(() => ({ showAlbumArt }));
      },
      resetState: () => undefined,
    }),
    {
      name: 'song-settings',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
