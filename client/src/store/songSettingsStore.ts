import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

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
  titleDropShadowEnabled: boolean;
  titleDropShadowSettings: string;
  titleTextStrokeEnabled: boolean;
  titleTextStrokeSettings: string;
  artistsDropShadowEnabled: boolean;
  artistsDropShadowSettings: string;
  artistsTextStrokeEnabled: boolean;
  artistsTextStrokeSettings: string;
  titleFontSizeValue: number;
  titleFontFamily: string;
  artistsFontSizeValue: number;
  artistsFontFamily: string;
  showAlbumArt: boolean;
  setPrimaryColor: (primaryColor: string) => void;
  setSecondaryColor: (secondaryColor: string) => void;
  setHeightValue: (heightValue: number) => void;
  setHeightUnit: (heightUnit: string) => void;
  setWidthValue: (widthValue: number) => void;
  setWidthUnit: (widthUnit: string) => void;
  setTitleDropShadowEnabled: (dropShadowEnabled: boolean) => void;
  setTitleDropShadowSettings: (dropShadowSettings: string) => void;
  setTitleTextStrokeEnabled: (textStrokeEnabled: boolean) => void;
  setTitleTextStrokeSettings: (textStrokeSettings: string) => void;
  setTitleFontSizeValue: (titleFontSizeValue: number) => void;
  setArtistsDropShadowEnabled: (dropShadowEnabled: boolean) => void;
  setArtistsDropShadowSettings: (dropShadowSettings: string) => void;
  setArtistsTextStrokeEnabled: (textStrokeEnabled: boolean) => void;
  setArtistsTextStrokeSettings: (textStrokeSettings: string) => void;
  setTitleFontFamily: (fontFamily: string) => void;
  setArtistsFontSizeValue: (artistsFontSizeValue: number) => void;
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
      titleDropShadowEnabled: false,
      titleDropShadowSettings: DEFAULT_SONG_SETTINGS_VALUES.dropShadowSettings,
      titleTextStrokeEnabled: false,
      titleTextStrokeSettings: DEFAULT_SONG_SETTINGS_VALUES.textStrokeSettings,
      artistsDropShadowEnabled: false,
      artistsDropShadowSettings: DEFAULT_SONG_SETTINGS_VALUES.dropShadowSettings,
      artistsTextStrokeEnabled: false,
      artistsTextStrokeSettings: DEFAULT_SONG_SETTINGS_VALUES.textStrokeSettings,
      titleFontSizeValue: DEFAULT_SONG_SETTINGS_VALUES.titleFontSizeValue,
      titleFontFamily: DEFAULT_SONG_SETTINGS_VALUES.titleFontFamily,
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
      setTitleDropShadowEnabled: (titleDropShadowEnabled: boolean) => {
        set(() => ({ titleDropShadowEnabled }));
      },
      setTitleDropShadowSettings: (titleDropShadowSettings: string) => {
        set(() => ({ titleDropShadowSettings }));
      },
      setTitleTextStrokeEnabled: (titleTextStrokeEnabled: boolean) => {
        set(() => ({ titleTextStrokeEnabled }));
      },
      setTitleTextStrokeSettings: (titleTextStrokeSettings: string) => {
        set(() => ({ titleTextStrokeSettings }));
      },
      setArtistsDropShadowEnabled: (artistsDropShadowEnabled: boolean) => {
        set(() => ({ artistsDropShadowEnabled }));
      },
      setArtistsDropShadowSettings: (artistsDropShadowSettings: string) => {
        set(() => ({ artistsDropShadowSettings }));
      },
      setArtistsTextStrokeEnabled: (artistsTextStrokeEnabled: boolean) => {
        set(() => ({ artistsTextStrokeEnabled }));
      },
      setArtistsTextStrokeSettings: (artistsTextStrokeSettings: string) => {
        set(() => ({ artistsTextStrokeSettings }));
      },
      setTitleFontSizeValue: (titleFontSizeValue: number) => {
        set(() => ({ titleFontSizeValue }));
      },
      setTitleFontFamily: (titleFontFamily: string) => {
        set(() => ({ titleFontFamily }));
      },
      setArtistsFontSizeValue: (artistsFontSizeValue: number) => {
        set(() => ({ artistsFontSizeValue }));
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
