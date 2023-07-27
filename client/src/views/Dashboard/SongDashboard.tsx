import { songSearchParamsMap } from '../Song/songSearchParamsMap';
import { SongDisplay } from '../Song/Song';
import useStore from '../../store/store';
import { useSongSettingsStore } from '../../store/songSettingsStore';
import { DEFAULT_SONG_SETTINGS_VALUES, PRESET_SONG_SETTINGS_VALUES } from '../../constants';
import { TextShadowPicker } from '../../components/TextShadowPicker';
import { FontPicker } from '../../components/FontPicker/FontPicker';
import { CSSSizePicker } from '../../components/CSSSizePicker/CSSSizePicker';
import { CopyButton } from '../../components/CopyButton/CopyButton';

import './SongDashboard.less';

export const SongDashboard = () => {
  const currentSong = useStore((s) => s.currentSong);
  const primaryColor = useSongSettingsStore((s) => s.primaryColor);
  const secondaryColor = useSongSettingsStore((s) => s.secondaryColor);
  const heightValue = useSongSettingsStore((s) => s.heightValue);
  const heightUnit = useSongSettingsStore((s) => s.heightUnit);
  const widthValue = useSongSettingsStore((s) => s.widthValue);
  const widthUnit = useSongSettingsStore((s) => s.widthUnit);
  const dropShadowEnabled = useSongSettingsStore((s) => s.dropShadowEnabled);
  const dropShadowSettings = useSongSettingsStore((s) => s.dropShadowSettings);
  const textStrokeEnabled = useSongSettingsStore((s) => s.textStrokeEnabled);
  const textStrokeSettings = useSongSettingsStore((s) => s.textStrokeSettings);
  const titleFontSizeValue = useSongSettingsStore((s) => s.titleFontSizeValue);
  const titleFontFamily = useSongSettingsStore((s) => s.titleFontFamily);
  const artistsFontSizeValue = useSongSettingsStore((s) => s.artistsFontSizeValue);
  const artistsFontFamily = useSongSettingsStore((s) => s.artistsFontFamily);
  const showAlbumArt = useSongSettingsStore((s) => s.showAlbumArt);

  const songURL = new URL(`${document.location.href}song`);

  if (primaryColor !== DEFAULT_SONG_SETTINGS_VALUES.primaryColor) {
    songURL.searchParams.append(songSearchParamsMap.primaryColor, primaryColor);
  }
  if (secondaryColor !== DEFAULT_SONG_SETTINGS_VALUES.secondaryColor) {
    songURL.searchParams.append(songSearchParamsMap.secondaryColor, secondaryColor);
  }
  if (heightValue !== DEFAULT_SONG_SETTINGS_VALUES.heightValue || heightUnit !== DEFAULT_SONG_SETTINGS_VALUES.heightUnit) {
    const height = `${heightValue}${heightUnit}`;
    songURL.searchParams.append(songSearchParamsMap.height, height);
  }
  if (widthValue !== DEFAULT_SONG_SETTINGS_VALUES.widthValue || widthUnit !== DEFAULT_SONG_SETTINGS_VALUES.widthUnit) {
    const width = `${widthValue}${widthUnit}`;
    songURL.searchParams.append(songSearchParamsMap.width, width);
  }
  if (dropShadowEnabled) {
    songURL.searchParams.append(songSearchParamsMap.dropShadowEnabled, 'true');
  }
  if (dropShadowEnabled && dropShadowSettings !== DEFAULT_SONG_SETTINGS_VALUES.dropShadowSettings) {
    songURL.searchParams.append(songSearchParamsMap.dropShadowSettings, dropShadowSettings);
  }
  if (textStrokeEnabled && textStrokeSettings !== DEFAULT_SONG_SETTINGS_VALUES.textStrokeSettings) {
    songURL.searchParams.append(songSearchParamsMap.textStrokeSettings, textStrokeSettings);
  }
  if (titleFontSizeValue !== DEFAULT_SONG_SETTINGS_VALUES.titleFontSizeValue) {
    songURL.searchParams.append(songSearchParamsMap.titleFontSize, String(titleFontSizeValue));
  }
  if (titleFontFamily !== DEFAULT_SONG_SETTINGS_VALUES.titleFontFamily) {
    songURL.searchParams.append(songSearchParamsMap.titleFontFamily, titleFontFamily);
  }
  if (artistsFontSizeValue !== DEFAULT_SONG_SETTINGS_VALUES.artistsFontSizeValue) {
    songURL.searchParams.append(songSearchParamsMap.artistsFontSize, String(artistsFontSizeValue));
  }

  if (artistsFontFamily !== DEFAULT_SONG_SETTINGS_VALUES.artistsFontFamily) {
    songURL.searchParams.append(songSearchParamsMap.artistsFontFamily, artistsFontFamily);
  }

  const songURLString = `${songURL.protocol}${'//'}${songURL.host}${songURL.pathname}${songURL.search}`;

  return (
    <div className="song-dashboard">
      <h2>Song</h2>
      <h3>Link to copy:</h3>
      <p>
        <span className="song-dashboard-note">Note</span>When you change options, copy the new version of the link and update your browser source.
      </p>
      <div className="link">
        <a target="_new" href={songURL.href}>
          {songURLString}
        </a>
      </div>
      <CopyButton textToCopy={songURLString} />
      <h3>Preview:</h3>
      <p>
        <span className="song-dashboard-note">Note</span> Make sure you are playing a song.
      </p>

      {currentSong && (
        <div className="song-dashboard-preview-wrapper">
          <SongDisplay
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            width={`${widthValue}${widthUnit}`}
            height={`${heightValue}${heightUnit}`}
            titleFontFamily={titleFontFamily}
            titleFontSize={`${titleFontSizeValue}`}
            artistsFontFamily={artistsFontFamily}
            artistsFontSize={`${artistsFontSizeValue}`}
            dropShadowEnabled={dropShadowEnabled}
            dropShadowSettings={dropShadowSettings}
            textStrokeEnabled={textStrokeEnabled}
            textStrokeSettings={textStrokeSettings}
            currentSong={currentSong}
            albumImage={currentSong.item.album.images[0].url}
            showAlbumArt={showAlbumArt}
          />
        </div>
      )}
      <h3>Settings:</h3>
      <p>These settings will be saved on this same computer for the next time you visit this page.</p>
      <div className="song-modifiers">
        <div className="song-modifiers-row song-modifiers-label-above">
          <label htmlFor="song_primary_color">Primary color</label>
          <input
            type="color"
            id="song_primary_color"
            value={primaryColor}
            onChange={(event) => useSongSettingsStore.getState().setPrimaryColor(event.target.value)}
          />
          <button onClick={() => useSongSettingsStore.getState().setPrimaryColor(DEFAULT_SONG_SETTINGS_VALUES.primaryColor)}>reset</button>
        </div>
        <div className="song-modifiers-row song-modifiers-label-above">
          <label htmlFor="song_secondary_color">Secondary color</label>
          <input
            type="color"
            id="song_secondary_color"
            value={secondaryColor}
            onChange={(event) => useSongSettingsStore.getState().setSecondaryColor(event.target.value)}
          />
          <button onClick={() => useSongSettingsStore.getState().setSecondaryColor(DEFAULT_SONG_SETTINGS_VALUES.secondaryColor)}>reset</button>
        </div>
        <div className="song-modifiers-row song-modifiers-label-above">
          <label htmlFor="font_size">Title font size (only in pixels)</label>
          <input value={titleFontSizeValue} type="number" onChange={(e) => useSongSettingsStore.getState().setTitleFontSizeValue(+e.target.value)} />
          <button
            onClick={() => {
              useSongSettingsStore.getState().setTitleFontSizeValue(PRESET_SONG_SETTINGS_VALUES.titleFontSizeValueSmall);
            }}
          >
            preset small
          </button>
          <button
            onClick={() => {
              useSongSettingsStore.getState().setTitleFontSizeValue(PRESET_SONG_SETTINGS_VALUES.titleFontSizeValueMedium);
            }}
          >
            preset medium
          </button>
          <button
            onClick={() => {
              useSongSettingsStore.getState().setTitleFontSizeValue(PRESET_SONG_SETTINGS_VALUES.titleFontSizeValueLarge);
            }}
          >
            preset large
          </button>
        </div>
        <div className="song-modifiers-row song-modifiers-label-above">
          <label htmlFor="font_family">Title font family</label>
          <FontPicker
            id="font_family"
            value={titleFontFamily}
            onChange={(fontFamily) => useSongSettingsStore.getState().setTitleFontFamily(fontFamily)}
          />

          <button onClick={() => useSongSettingsStore.getState().setTitleFontFamily(DEFAULT_SONG_SETTINGS_VALUES.titleFontFamily)}>reset</button>
        </div>
        <div className="song-modifiers-row song-modifiers-label-above">
          <label htmlFor="font_size">Artists font size (only in pixels)</label>
          <input
            value={artistsFontSizeValue}
            type="number"
            onChange={(e) => useSongSettingsStore.getState().setArtistsFontSizeValue(+e.target.value)}
          />
          <button
            onClick={() => {
              useSongSettingsStore.getState().setArtistsFontSizeValue(PRESET_SONG_SETTINGS_VALUES.artistsFontSizeValueSmall);
            }}
          >
            preset small
          </button>
          <button
            onClick={() => {
              useSongSettingsStore.getState().setArtistsFontSizeValue(PRESET_SONG_SETTINGS_VALUES.artistsFontSizeValueMedium);
            }}
          >
            preset medium
          </button>
          <button
            onClick={() => {
              useSongSettingsStore.getState().setArtistsFontSizeValue(PRESET_SONG_SETTINGS_VALUES.artistsFontSizeValueLarge);
            }}
          >
            preset large
          </button>
        </div>
        <div className="song-modifiers-row song-modifiers-label-above">
          <label htmlFor="font_family">Artists font family</label>
          <FontPicker
            id="font_family"
            value={artistsFontFamily}
            onChange={(fontFamily) => useSongSettingsStore.getState().setArtistsFontFamily(fontFamily)}
          />

          <button onClick={() => useSongSettingsStore.getState().setArtistsFontFamily(DEFAULT_SONG_SETTINGS_VALUES.artistsFontFamily)}>reset</button>
        </div>
        <div className="song-modifiers-row song-modifiers-label-above">
          <label htmlFor="song_width">Overlay Width</label>
          <CSSSizePicker
            id="song_width"
            defaultValue={DEFAULT_SONG_SETTINGS_VALUES.widthValue}
            defaultUnit={DEFAULT_SONG_SETTINGS_VALUES.widthUnit}
            value={widthValue}
            unit={widthUnit}
            onValueChange={(widthValue) => {
              useSongSettingsStore.getState().setWidthValue(widthValue);
            }}
            onUnitChange={(widthUnit) => {
              useSongSettingsStore.getState().setWidthUnit(widthUnit);
            }}
            cssUnits={['px', 'vw', 'em']}
          />
        </div>
        <div className="song-modifiers-row song-modifiers-label-above">
          <label htmlFor="song_height">Overlay Height</label>
          <CSSSizePicker
            id="song_height"
            defaultValue={DEFAULT_SONG_SETTINGS_VALUES.heightValue}
            defaultUnit={DEFAULT_SONG_SETTINGS_VALUES.heightUnit}
            value={heightValue}
            unit={heightUnit}
            onValueChange={(heightValue) => {
              useSongSettingsStore.getState().setHeightValue(heightValue);
            }}
            onUnitChange={(heightUnit) => {
              useSongSettingsStore.getState().setHeightUnit(heightUnit);
            }}
            cssUnits={['px', 'vh', 'em']}
          />
        </div>
        <div className="song-modifiers-row">
          <input
            type="checkbox"
            id="song_has_album_art"
            checked={showAlbumArt}
            onChange={(event) => useSongSettingsStore.getState().setShowAlbumArt(event.target.checked)}
          />
          <label htmlFor="song_has_album_art">Display album art</label>
        </div>
        <div className="song-modifiers-row">
          <input
            type="checkbox"
            id="song_has_drop_shadow"
            checked={dropShadowEnabled}
            onChange={(event) => useSongSettingsStore.getState().setDropShadowEnabled(event.target.checked)}
          />
          <label htmlFor="song_has_drop_shadow">Text has drop shadow</label>
        </div>
        {dropShadowEnabled && (
          <div className="song-modifiers-row song-modifiers-label-above">
            <label htmlFor="song_drop_shadow">Drop shadow settings</label>
            <TextShadowPicker
              value={dropShadowSettings}
              onChange={(value) => {
                useSongSettingsStore.getState().setDropShadowSettings(value);
              }}
            />
            <button onClick={() => useSongSettingsStore.getState().setDropShadowSettings(PRESET_SONG_SETTINGS_VALUES.dropShadowSettingsPresetSmall)}>
              preset small
            </button>
            <button onClick={() => useSongSettingsStore.getState().setDropShadowSettings(PRESET_SONG_SETTINGS_VALUES.dropShadowSettingsPresetMedium)}>
              preset medium
            </button>
            <button onClick={() => useSongSettingsStore.getState().setDropShadowSettings(PRESET_SONG_SETTINGS_VALUES.dropShadowSettingsPresetLarge)}>
              preset large
            </button>
            <button
              className="song-dashboard-button_danger"
              onClick={() => useSongSettingsStore.getState().setDropShadowSettings(DEFAULT_SONG_SETTINGS_VALUES.dropShadowSettings)}
            >
              reset to default (preset small)
            </button>
          </div>
        )}
        <div className="song-modifiers-row">
          <input
            type="checkbox"
            id="song_has_text_stroke"
            checked={textStrokeEnabled}
            onChange={(event) => useSongSettingsStore.getState().setTextStrokeEnabled(event.target.checked)}
          />
          <label htmlFor="song_has_text_stroke">Text has stroke</label>
        </div>
        {textStrokeEnabled && (
          <div className="song-modifiers-row">
            <input
              type="text"
              id="song_text_stroke"
              value={textStrokeSettings}
              onChange={(event) => useSongSettingsStore.getState().setTextStrokeSettings(event.target.value)}
            />
            <label htmlFor="song_text_stroke">Text stroke settings</label>
            <button onClick={() => useSongSettingsStore.getState().setTextStrokeSettings(PRESET_SONG_SETTINGS_VALUES.textStrokeSettingsPresetThin)}>
              preset thin
            </button>
            <button onClick={() => useSongSettingsStore.getState().setTextStrokeSettings(PRESET_SONG_SETTINGS_VALUES.textStrokeSettingsPresetMedium)}>
              preset medium
            </button>
            <button onClick={() => useSongSettingsStore.getState().setTextStrokeSettings(PRESET_SONG_SETTINGS_VALUES.textStrokeSettingsPresetThick)}>
              preset thick
            </button>
            <button
              className="song-dashboard-button_danger"
              onClick={() => useSongSettingsStore.getState().setTextStrokeSettings(DEFAULT_SONG_SETTINGS_VALUES.textStrokeSettings)}
            >
              reset to default (preset thin)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
