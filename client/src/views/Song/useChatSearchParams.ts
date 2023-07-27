import { DEFAULT_SONG_SETTINGS_VALUES } from '../../constants';
import { songSearchParamsMap } from './songSearchParamsMap';

export const useSongSearchParams = () => {
  const searchParams = new URLSearchParams(window.location.search);

  const primaryColor = searchParams.get(songSearchParamsMap.primaryColor) || DEFAULT_SONG_SETTINGS_VALUES.primaryColor;
  const secondaryColor = searchParams.get(songSearchParamsMap.secondaryColor) || DEFAULT_SONG_SETTINGS_VALUES.secondaryColor;
  const height =
    searchParams.get(songSearchParamsMap.height) || `${DEFAULT_SONG_SETTINGS_VALUES.heightValue}${DEFAULT_SONG_SETTINGS_VALUES.heightUnit}`;
  const width = searchParams.get(songSearchParamsMap.width) || `${DEFAULT_SONG_SETTINGS_VALUES.widthValue}${DEFAULT_SONG_SETTINGS_VALUES.widthUnit}`;
  const dropShadowEnabled = searchParams.get(songSearchParamsMap.dropShadowEnabled) === 'true' ? true : false;
  const dropShadowSettings = searchParams.get(songSearchParamsMap.dropShadowSettings) || DEFAULT_SONG_SETTINGS_VALUES.dropShadowSettings;
  const textStrokeEnabled = searchParams.get(songSearchParamsMap.textStrokeEnabled) === 'true' ? true : false;
  const textStrokeSettings = searchParams.get(songSearchParamsMap.textStrokeSettings) || DEFAULT_SONG_SETTINGS_VALUES.textStrokeSettings;
  const titleFontSize = String(searchParams.get(songSearchParamsMap.titleFontSize) || DEFAULT_SONG_SETTINGS_VALUES.titleFontSizeValue);
  const titleFontFamily = searchParams.get(songSearchParamsMap.titleFontFamily) || DEFAULT_SONG_SETTINGS_VALUES.titleFontFamily;
  const artistsFontSize = String(searchParams.get(songSearchParamsMap.artistsFontSize) || DEFAULT_SONG_SETTINGS_VALUES.artistsFontSizeValue);
  const artistsFontFamily = searchParams.get(songSearchParamsMap.artistsFontFamily) || DEFAULT_SONG_SETTINGS_VALUES.artistsFontFamily;
  const showAlbumArt = searchParams.get(songSearchParamsMap.showAlbumArt) === 'true' ? true : false;

  return {
    primaryColor,
    secondaryColor,
    height,
    width,
    dropShadowEnabled,
    dropShadowSettings,
    textStrokeEnabled,
    textStrokeSettings,
    titleFontSize,
    titleFontFamily,
    artistsFontSize,
    artistsFontFamily,
    showAlbumArt,
  };
};
