import { DEFAULT_SONG_SETTINGS_VALUES } from "../../constants";
import { songSearchParamsMap } from "./songSearchParamsMap";

export const useSongSearchParams = () => {
  const searchParams = new URLSearchParams(window.location.search);

  const primaryColor =
    searchParams.get(songSearchParamsMap.primaryColor) ||
    DEFAULT_SONG_SETTINGS_VALUES.primaryColor;
  const secondaryColor =
    searchParams.get(songSearchParamsMap.secondaryColor) ||
    DEFAULT_SONG_SETTINGS_VALUES.secondaryColor;
  const height =
    searchParams.get(songSearchParamsMap.height) ||
    `${DEFAULT_SONG_SETTINGS_VALUES.heightValue}${DEFAULT_SONG_SETTINGS_VALUES.heightUnit}`;
  const width =
    searchParams.get(songSearchParamsMap.width) ||
    `${DEFAULT_SONG_SETTINGS_VALUES.widthValue}${DEFAULT_SONG_SETTINGS_VALUES.widthUnit}`;
  const titleDropShadowEnabled =
    searchParams.get(songSearchParamsMap.titleDropShadowEnabled) === "true"
      ? true
      : false;
  const titleDropShadowSettings =
    searchParams.get(songSearchParamsMap.titleDropShadowSettings) ||
    DEFAULT_SONG_SETTINGS_VALUES.dropShadowSettings;
  const titleTextStrokeEnabled =
    searchParams.get(songSearchParamsMap.titleTextStrokeEnabled) === "true"
      ? true
      : false;
  const titleTextStrokeSettings =
    searchParams.get(songSearchParamsMap.titleTextStrokeSettings) ||
    DEFAULT_SONG_SETTINGS_VALUES.textStrokeSettings;
  const artistsDropShadowEnabled =
    searchParams.get(songSearchParamsMap.artistsDropShadowEnabled) === "true"
      ? true
      : false;
  const artistsDropShadowSettings =
    searchParams.get(songSearchParamsMap.artistsDropShadowSettings) ||
    DEFAULT_SONG_SETTINGS_VALUES.dropShadowSettings;
  const artistsTextStrokeEnabled =
    searchParams.get(songSearchParamsMap.artistsTextStrokeEnabled) === "true"
      ? true
      : false;
  const artistsTextStrokeSettings =
    searchParams.get(songSearchParamsMap.artistsTextStrokeSettings) ||
    DEFAULT_SONG_SETTINGS_VALUES.textStrokeSettings;
  const titleFontSize = String(
    searchParams.get(songSearchParamsMap.titleFontSize) ||
      DEFAULT_SONG_SETTINGS_VALUES.titleFontSizeValue,
  );
  const titleFontFamily =
    searchParams.get(songSearchParamsMap.titleFontFamily) ||
    DEFAULT_SONG_SETTINGS_VALUES.titleFontFamily;
  const artistsFontSize = String(
    searchParams.get(songSearchParamsMap.artistsFontSize) ||
      DEFAULT_SONG_SETTINGS_VALUES.artistsFontSizeValue,
  );
  const artistsFontFamily =
    searchParams.get(songSearchParamsMap.artistsFontFamily) ||
    DEFAULT_SONG_SETTINGS_VALUES.artistsFontFamily;
  const showAlbumArt =
    searchParams.get(songSearchParamsMap.showAlbumArt) === "false"
      ? false
      : true;

  return {
    primaryColor,
    secondaryColor,
    height,
    width,
    titleDropShadowEnabled,
    titleDropShadowSettings,
    titleTextStrokeEnabled,
    titleTextStrokeSettings,
    artistsDropShadowEnabled,
    artistsDropShadowSettings,
    artistsTextStrokeEnabled,
    artistsTextStrokeSettings,
    titleFontSize,
    titleFontFamily,
    artistsFontSize,
    artistsFontFamily,
    showAlbumArt,
  };
};
