import { CopyButton } from '../../components/CopyButton/CopyButton';
import { CSSSizePicker } from '../../components/CSSSizePicker/CSSSizePicker';
import { FontPicker } from '../../components/FontPicker/FontPicker';
import { TextShadowPicker } from '../../components/TextShadowPicker';
import { DEFAULT_SONG_SETTINGS_VALUES, PRESET_SONG_SETTINGS_VALUES } from '../../constants';
import { useSongSettingsStore } from '../../store/songSettingsStore';
import useStore from '../../store/store';
import { SongDisplay } from '../Song/Song';
import { songSearchParamsMap } from '../Song/songSearchParamsMap';

import './SongDashboard.less';

export const SongDashboard = () => {
  const currentSong = useStore((s) => s.currentSong);
  const primaryColor = useSongSettingsStore((s) => s.primaryColor);
  const secondaryColor = useSongSettingsStore((s) => s.secondaryColor);
  const heightValue = useSongSettingsStore((s) => s.heightValue);
  const heightUnit = useSongSettingsStore((s) => s.heightUnit);
  const widthValue = useSongSettingsStore((s) => s.widthValue);
  const widthUnit = useSongSettingsStore((s) => s.widthUnit);
  const titleDropShadowEnabled = useSongSettingsStore((s) => s.titleDropShadowEnabled);
  const titleDropShadowSettings = useSongSettingsStore((s) => s.titleDropShadowSettings);
  const titleTextStrokeEnabled = useSongSettingsStore((s) => s.titleTextStrokeEnabled);
  const titleTextStrokeSettings = useSongSettingsStore((s) => s.titleTextStrokeSettings);
  const artistsDropShadowEnabled = useSongSettingsStore((s) => s.artistsDropShadowEnabled);
  const artistsDropShadowSettings = useSongSettingsStore((s) => s.artistsDropShadowSettings);
  const artistsTextStrokeEnabled = useSongSettingsStore((s) => s.artistsTextStrokeEnabled);
  const artistsTextStrokeSettings = useSongSettingsStore((s) => s.artistsTextStrokeSettings);
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
  if (titleDropShadowEnabled) {
    songURL.searchParams.append(songSearchParamsMap.titleDropShadowEnabled, 'true');
  }
  if (titleDropShadowEnabled && titleDropShadowSettings !== DEFAULT_SONG_SETTINGS_VALUES.dropShadowSettings) {
    songURL.searchParams.append(songSearchParamsMap.titleDropShadowSettings, titleDropShadowSettings);
  }
  if (titleTextStrokeEnabled) {
    songURL.searchParams.append(songSearchParamsMap.titleTextStrokeEnabled, 'true');
  }
  if (artistsTextStrokeEnabled && artistsTextStrokeSettings !== DEFAULT_SONG_SETTINGS_VALUES.textStrokeSettings) {
    songURL.searchParams.append(songSearchParamsMap.artistsTextStrokeSettings, artistsTextStrokeSettings);
  }
  if (artistsDropShadowEnabled) {
    songURL.searchParams.append(songSearchParamsMap.artistsDropShadowEnabled, 'true');
  }
  if (artistsDropShadowEnabled && artistsDropShadowSettings !== DEFAULT_SONG_SETTINGS_VALUES.dropShadowSettings) {
    songURL.searchParams.append(songSearchParamsMap.artistsDropShadowSettings, artistsDropShadowSettings);
  }
  if (artistsTextStrokeEnabled) {
    songURL.searchParams.append(songSearchParamsMap.artistsTextStrokeEnabled, 'true');
  }
  if (titleTextStrokeEnabled && titleTextStrokeSettings !== DEFAULT_SONG_SETTINGS_VALUES.textStrokeSettings) {
    songURL.searchParams.append(songSearchParamsMap.titleTextStrokeSettings, titleTextStrokeSettings);
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
  if (!showAlbumArt) {
    songURL.searchParams.append(songSearchParamsMap.showAlbumArt, 'false');
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
            titleDropShadowEnabled={titleDropShadowEnabled}
            titleDropShadowSettings={titleDropShadowSettings}
            titleTextStrokeEnabled={titleTextStrokeEnabled}
            titleTextStrokeSettings={titleTextStrokeSettings}
            artistsDropShadowEnabled={artistsDropShadowEnabled}
            artistsDropShadowSettings={artistsDropShadowSettings}
            artistsTextStrokeEnabled={artistsTextStrokeEnabled}
            artistsTextStrokeSettings={artistsTextStrokeSettings}
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
            id="song_title_has_drop_shadow"
            checked={titleDropShadowEnabled}
            onChange={(event) => useSongSettingsStore.getState().setTitleDropShadowEnabled(event.target.checked)}
          />
          <label htmlFor="song_title_has_drop_shadow">Title text has drop shadow</label>
        </div>
        {titleDropShadowEnabled && (
          <div className="song-modifiers-row song-modifiers-label-above">
            <label htmlFor="song_title_drop_shadow">Title text drop shadow settings</label>
            <TextShadowPicker
              value={titleDropShadowSettings}
              onChange={(value) => {
                useSongSettingsStore.getState().setTitleDropShadowSettings(value);
              }}
            />
            <button
              onClick={() => useSongSettingsStore.getState().setTitleDropShadowSettings(PRESET_SONG_SETTINGS_VALUES.dropShadowSettingsPresetSmall)}
            >
              preset small
            </button>
            <button
              onClick={() => useSongSettingsStore.getState().setTitleDropShadowSettings(PRESET_SONG_SETTINGS_VALUES.dropShadowSettingsPresetMedium)}
            >
              preset medium
            </button>
            <button
              onClick={() => useSongSettingsStore.getState().setTitleDropShadowSettings(PRESET_SONG_SETTINGS_VALUES.dropShadowSettingsPresetLarge)}
            >
              preset large
            </button>
            <button
              className="song-dashboard-button_danger"
              onClick={() => useSongSettingsStore.getState().setTitleDropShadowSettings(DEFAULT_SONG_SETTINGS_VALUES.dropShadowSettings)}
            >
              reset to default (preset small)
            </button>
          </div>
        )}
        <div className="song-modifiers-row">
          <input
            type="checkbox"
            id="song_title_has_text_stroke"
            checked={titleTextStrokeEnabled}
            onChange={(event) => useSongSettingsStore.getState().setTitleTextStrokeEnabled(event.target.checked)}
          />
          <label htmlFor="song_title_has_text_stroke">Title text has stroke</label>
        </div>
        {titleTextStrokeEnabled && (
          <div className="song-modifiers-row">
            <input
              type="text"
              id="song_title_text_stroke"
              value={titleTextStrokeSettings}
              onChange={(event) => useSongSettingsStore.getState().setTitleTextStrokeSettings(event.target.value)}
            />
            <label htmlFor="song_title_text_stroke">Text stroke settings</label>
            <button
              onClick={() => useSongSettingsStore.getState().setTitleTextStrokeSettings(PRESET_SONG_SETTINGS_VALUES.textStrokeSettingsPresetThin)}
            >
              preset thin
            </button>
            <button
              onClick={() => useSongSettingsStore.getState().setTitleTextStrokeSettings(PRESET_SONG_SETTINGS_VALUES.textStrokeSettingsPresetMedium)}
            >
              preset medium
            </button>
            <button
              onClick={() => useSongSettingsStore.getState().setTitleTextStrokeSettings(PRESET_SONG_SETTINGS_VALUES.textStrokeSettingsPresetThick)}
            >
              preset thick
            </button>
            <button
              className="song-dashboard-button_danger"
              onClick={() => useSongSettingsStore.getState().setTitleTextStrokeSettings(DEFAULT_SONG_SETTINGS_VALUES.textStrokeSettings)}
            >
              reset to default (preset thin)
            </button>
          </div>
        )}
        <div className="song-modifiers-row">
          <input
            type="checkbox"
            id="song_artists_has_drop_shadow"
            checked={artistsDropShadowEnabled}
            onChange={(event) => useSongSettingsStore.getState().setArtistsDropShadowEnabled(event.target.checked)}
          />
          <label htmlFor="song_artists_has_drop_shadow">Artists text has drop shadow</label>
        </div>
        {artistsDropShadowEnabled && (
          <div className="song-modifiers-row song-modifiers-label-above">
            <label htmlFor="song_artists_drop_shadow">Artists text drop shadow settings</label>
            <TextShadowPicker
              value={artistsDropShadowSettings}
              onChange={(value) => {
                useSongSettingsStore.getState().setArtistsDropShadowSettings(value);
              }}
            />
            <button
              onClick={() => useSongSettingsStore.getState().setArtistsDropShadowSettings(PRESET_SONG_SETTINGS_VALUES.dropShadowSettingsPresetSmall)}
            >
              preset small
            </button>
            <button
              onClick={() => useSongSettingsStore.getState().setArtistsDropShadowSettings(PRESET_SONG_SETTINGS_VALUES.dropShadowSettingsPresetMedium)}
            >
              preset medium
            </button>
            <button
              onClick={() => useSongSettingsStore.getState().setArtistsDropShadowSettings(PRESET_SONG_SETTINGS_VALUES.dropShadowSettingsPresetLarge)}
            >
              preset large
            </button>
            <button
              className="song-dashboard-button_danger"
              onClick={() => useSongSettingsStore.getState().setArtistsDropShadowSettings(DEFAULT_SONG_SETTINGS_VALUES.dropShadowSettings)}
            >
              reset to default (preset small)
            </button>
          </div>
        )}
        <div className="song-modifiers-row">
          <input
            type="checkbox"
            id="song_artists_has_text_stroke"
            checked={artistsTextStrokeEnabled}
            onChange={(event) => useSongSettingsStore.getState().setArtistsTextStrokeEnabled(event.target.checked)}
          />
          <label htmlFor="song_artists_has_text_stroke">Artists text has stroke</label>
        </div>
        {artistsTextStrokeEnabled && (
          <div className="song-modifiers-row">
            <input
              type="text"
              id="song_artists_text_stroke"
              value={artistsTextStrokeSettings}
              onChange={(event) => useSongSettingsStore.getState().setArtistsTextStrokeSettings(event.target.value)}
            />
            <label htmlFor="song_artists_text_stroke">Text stroke settings</label>
            <button
              onClick={() => useSongSettingsStore.getState().setArtistsTextStrokeSettings(PRESET_SONG_SETTINGS_VALUES.textStrokeSettingsPresetThin)}
            >
              preset thin
            </button>
            <button
              onClick={() => useSongSettingsStore.getState().setArtistsTextStrokeSettings(PRESET_SONG_SETTINGS_VALUES.textStrokeSettingsPresetMedium)}
            >
              preset medium
            </button>
            <button
              onClick={() => useSongSettingsStore.getState().setArtistsTextStrokeSettings(PRESET_SONG_SETTINGS_VALUES.textStrokeSettingsPresetThick)}
            >
              preset thick
            </button>
            <button
              className="song-dashboard-button_danger"
              onClick={() => useSongSettingsStore.getState().setArtistsTextStrokeSettings(DEFAULT_SONG_SETTINGS_VALUES.textStrokeSettings)}
            >
              reset to default (preset thin)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
