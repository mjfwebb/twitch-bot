export const PRESET_CHAT_SETTINGS_VALUES = {
  dropShadowSettingsPresetSmall: "1px 1px 2px #000000ff",
  dropShadowSettingsPresetMedium: "2px 2px 4px #000000ff",
  dropShadowSettingsPresetLarge: "2px 2px 6px #000000ff",
  textStrokeSettingsPresetThin: "1px black",
  textStrokeSettingsPresetMedium: "2px black",
  textStrokeSettingsPresetThick: "3px black",
  fontSizeValueSmall: 0.75,
  fontSizeValueMedium: 1,
  fontSizeValueLarge: 1.25,
  fontSizeUnit: "em",
};

export const DEFAULT_CHAT_SETTINGS_VALUES = {
  heightValue: 100,
  heightUnit: "vh",
  widthValue: 500,
  widthUnit: "px",
  secondsBeforeExit: 10,
  backgroundColor: "transparent",
  foregroundColor: "#ffffff",
  dropShadowSettings: PRESET_CHAT_SETTINGS_VALUES.dropShadowSettingsPresetSmall,
  textStrokeSettings: PRESET_CHAT_SETTINGS_VALUES.textStrokeSettingsPresetThin,
  fontSizeValue: PRESET_CHAT_SETTINGS_VALUES.fontSizeValueMedium,
  fontSizeUnit: PRESET_CHAT_SETTINGS_VALUES.fontSizeUnit,
  fontFamily: "Sans-Serif",
};

export const PRESET_SONG_SETTINGS_VALUES = {
  dropShadowSettingsPresetSmall: "1px 1px 2px #000000ff",
  dropShadowSettingsPresetMedium: "2px 2px 4px #000000ff",
  dropShadowSettingsPresetLarge: "2px 2px 6px #000000ff",
  textStrokeSettingsPresetThin: "1px black",
  textStrokeSettingsPresetMedium: "2px black",
  textStrokeSettingsPresetThick: "3px black",
  titleFontSizeValueSmall: 16,
  titleFontSizeValueMedium: 24,
  titleFontSizeValueLarge: 32,
  artistsFontSizeValueSmall: 12,
  artistsFontSizeValueMedium: 16,
  artistsFontSizeValueLarge: 20,
};

export const DEFAULT_SONG_SETTINGS_VALUES = {
  heightValue: 128,
  heightUnit: "px",
  widthValue: 500,
  widthUnit: "px",
  primaryColor: "#ffffff",
  secondaryColor: "#50e0be",
  dropShadowSettings: PRESET_SONG_SETTINGS_VALUES.dropShadowSettingsPresetSmall,
  textStrokeSettings: PRESET_SONG_SETTINGS_VALUES.textStrokeSettingsPresetThin,
  titleFontSizeValue: PRESET_SONG_SETTINGS_VALUES.titleFontSizeValueMedium,
  titleFontFamily: "Sans-Serif",
  artistsFontSizeValue: PRESET_SONG_SETTINGS_VALUES.artistsFontSizeValueMedium,
  artistsFontFamily: "Sans-Serif",
  showAlbumArt: true,
};
