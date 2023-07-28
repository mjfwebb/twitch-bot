import { useEffect, useState } from 'react';

import { CopyButton } from '../../components/CopyButton/CopyButton';
import { CSSSizePicker } from '../../components/CSSSizePicker/CSSSizePicker';
import { FontPicker } from '../../components/FontPicker/FontPicker';
import { TextShadowPicker } from '../../components/TextShadowPicker';
import { DEFAULT_CHAT_SETTINGS_VALUES, PRESET_CHAT_SETTINGS_VALUES } from '../../constants';
import useSocketContext from '../../hooks/useSocketContext';
import { useChatSettingsStore } from '../../store/chatSettingsStore';
import { chatSearchParamsMap } from '../Chat/chatSearchParamsMap';
import { ChatPreview } from './ChatPreview';

import './ChatDashboard.less';

export const ChatDashboard = () => {
  const socket = useSocketContext();
  const [numberOfFakeMessages, setNumberOfFakeMessages] = useState<number>(5);
  const [numberOfFakeMessagesPerSecond, setNumberOfFakeMessagesPerSecond] = useState<number>(0);
  const [sendFakeMessagesPerSecond, setSendFakeMessagesPerSecond] = useState<boolean>(false);
  const backgroundColor = useChatSettingsStore((s) => s.backgroundColor);
  const foregroundColor = useChatSettingsStore((s) => s.foregroundColor);
  const showAvatars = useChatSettingsStore((s) => s.showAvatars);
  const showBorders = useChatSettingsStore((s) => s.showBorders);
  const showColonAfterDisplayName = useChatSettingsStore((s) => s.showColonAfterDisplayName);
  const heightValue = useChatSettingsStore((s) => s.heightValue);
  const heightUnit = useChatSettingsStore((s) => s.heightUnit);
  const widthValue = useChatSettingsStore((s) => s.widthValue);
  const widthUnit = useChatSettingsStore((s) => s.widthUnit);
  const animatedExit = useChatSettingsStore((s) => s.animatedExit);
  const secondsBeforeExit = useChatSettingsStore((s) => s.secondsBeforeExit);
  const animatedEntry = useChatSettingsStore((s) => s.animatedEntry);
  const dropShadowEnabled = useChatSettingsStore((s) => s.dropShadowEnabled);
  const dropShadowSettings = useChatSettingsStore((s) => s.dropShadowSettings);
  const textStrokeEnabled = useChatSettingsStore((s) => s.textStrokeEnabled);
  const textStrokeSettings = useChatSettingsStore((s) => s.textStrokeSettings);
  const fontSizeValue = useChatSettingsStore((s) => s.fontSizeValue);
  const fontSizeUnit = useChatSettingsStore((s) => s.fontSizeUnit);
  const fontFamily = useChatSettingsStore((s) => s.fontFamily);

  useEffect(() => {
    if (sendFakeMessagesPerSecond && numberOfFakeMessagesPerSecond > 0) {
      const interval = setInterval(() => {
        socket.sendToServer('getFakeChatMessages', numberOfFakeMessagesPerSecond);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [sendFakeMessagesPerSecond, numberOfFakeMessagesPerSecond, socket]);

  const chatURL = new URL(`${document.location.href}chat`);

  if (backgroundColor !== DEFAULT_CHAT_SETTINGS_VALUES.backgroundColor) {
    chatURL.searchParams.append(chatSearchParamsMap.backgroundColor, backgroundColor);
  }
  if (foregroundColor !== DEFAULT_CHAT_SETTINGS_VALUES.foregroundColor) {
    chatURL.searchParams.append(chatSearchParamsMap.foregroundColor, foregroundColor);
  }
  if (showAvatars === false) {
    chatURL.searchParams.append(chatSearchParamsMap.showAvatars, 'false');
  }
  if (showBorders === false) {
    chatURL.searchParams.append(chatSearchParamsMap.showBorders, 'false');
  }
  if (showColonAfterDisplayName === true) {
    chatURL.searchParams.append(chatSearchParamsMap.showColonAfterDisplayName, 'true');
  }
  if (heightValue !== DEFAULT_CHAT_SETTINGS_VALUES.heightValue || heightUnit !== DEFAULT_CHAT_SETTINGS_VALUES.heightUnit) {
    const height = `${heightValue}${heightUnit}`;
    chatURL.searchParams.append(chatSearchParamsMap.height, height);
  }
  if (widthValue !== DEFAULT_CHAT_SETTINGS_VALUES.widthValue || widthUnit !== DEFAULT_CHAT_SETTINGS_VALUES.widthUnit) {
    const width = `${widthValue}${widthUnit}`;
    chatURL.searchParams.append(chatSearchParamsMap.width, width);
  }
  if (animatedExit) {
    chatURL.searchParams.append(chatSearchParamsMap.animatedExit, 'true');
  }
  if (animatedExit && secondsBeforeExit !== DEFAULT_CHAT_SETTINGS_VALUES.secondsBeforeExit) {
    chatURL.searchParams.append(chatSearchParamsMap.secondsBeforeExit, String(secondsBeforeExit));
  }
  if (animatedEntry === false) {
    chatURL.searchParams.append(chatSearchParamsMap.animatedEntry, 'false');
  }
  if (dropShadowEnabled) {
    chatURL.searchParams.append(chatSearchParamsMap.dropShadowEnabled, 'true');
  }
  if (dropShadowEnabled && dropShadowSettings !== DEFAULT_CHAT_SETTINGS_VALUES.dropShadowSettings) {
    chatURL.searchParams.append(chatSearchParamsMap.dropShadowSettings, dropShadowSettings);
  }
  if (textStrokeEnabled && textStrokeSettings !== DEFAULT_CHAT_SETTINGS_VALUES.textStrokeSettings) {
    chatURL.searchParams.append(chatSearchParamsMap.textStrokeSettings, textStrokeSettings);
  }
  if (fontSizeValue !== DEFAULT_CHAT_SETTINGS_VALUES.fontSizeValue || fontSizeUnit !== DEFAULT_CHAT_SETTINGS_VALUES.fontSizeUnit) {
    const fontSize = `${fontSizeValue}${fontSizeUnit}`;
    chatURL.searchParams.append(chatSearchParamsMap.fontSize, fontSize);
  }
  if (fontFamily !== DEFAULT_CHAT_SETTINGS_VALUES.fontFamily) {
    chatURL.searchParams.append(chatSearchParamsMap.fontFamily, fontFamily);
  }

  const chatURLString = `${chatURL.protocol}${'//'}${chatURL.host}${chatURL.pathname}${chatURL.search}`;

  return (
    <div className="chat-dashboard">
      <h2>Chat</h2>
      <h3>Link to copy:</h3>
      <p>
        <span className="chat-dashboard-note">Note</span>When you change options, copy the new version of the link and update your browser source.
      </p>
      <div className="link">
        <a target="_new" href={chatURL.href}>
          {chatURLString}
        </a>
      </div>
      <CopyButton textToCopy={chatURLString} />
      <h3>Preview:</h3>
      <p>
        <span className="chat-dashboard-note">Note</span> This is a preview of what the chat will look like. It may not be 100% accurate, but it
        should be close. To get a better idea of what it will look like, you can copy the link above and open it in a new tab and send some test
        messages.
      </p>
      <div className="chat-dashboard-preview-wrapper">
        <div
          className="chat-dashboard-preview"
          style={{
            background: backgroundColor,
            color: foregroundColor,
            fontFamily,
            fontSize: `${fontSizeValue}${fontSizeUnit}`,
          }}
        >
          <ChatPreview />
        </div>
      </div>
      <h3>Settings:</h3>
      <p>These settings will be saved on this same computer for the next time you visit this page.</p>
      <div className="chat-modifiers">
        <div className="chat-modifiers-row chat-modifiers-label-above">
          <label htmlFor="chat_background">Background color (default is transparent)</label>
          <input
            type="color"
            id="chat_background"
            value={backgroundColor}
            onChange={(event) => useChatSettingsStore.getState().setBackgroundColor(event.target.value)}
          />
          <button onClick={() => useChatSettingsStore.getState().setBackgroundColor(DEFAULT_CHAT_SETTINGS_VALUES.backgroundColor)}>reset</button>
        </div>
        <div className="chat-modifiers-row chat-modifiers-label-above">
          <label htmlFor="chat_foreground">Foreground color</label>
          <input
            type="color"
            id="chat_foreground"
            value={foregroundColor}
            onChange={(event) => useChatSettingsStore.getState().setForegroundColor(event.target.value)}
          />
          <button onClick={() => useChatSettingsStore.getState().setForegroundColor(DEFAULT_CHAT_SETTINGS_VALUES.foregroundColor)}>reset</button>
        </div>
        <div className="chat-modifiers-row chat-modifiers-label-above">
          <label htmlFor="font_size">Font size</label>
          <CSSSizePicker
            id="font_size"
            defaultValue={DEFAULT_CHAT_SETTINGS_VALUES.fontSizeValue}
            defaultUnit={DEFAULT_CHAT_SETTINGS_VALUES.fontSizeUnit}
            value={fontSizeValue}
            unit={fontSizeUnit}
            onValueChange={(fontSizeValue) => {
              useChatSettingsStore.getState().setFontSizeValue(fontSizeValue);
            }}
            onUnitChange={(fontSizeUnit) => {
              useChatSettingsStore.getState().setFontSizeUnit(fontSizeUnit);
            }}
          />
          <button
            onClick={() => {
              useChatSettingsStore.getState().setFontSizeValue(PRESET_CHAT_SETTINGS_VALUES.fontSizeValueSmall);
              useChatSettingsStore.getState().setFontSizeUnit(PRESET_CHAT_SETTINGS_VALUES.fontSizeUnit);
            }}
          >
            preset small
          </button>
          <button
            onClick={() => {
              useChatSettingsStore.getState().setFontSizeValue(PRESET_CHAT_SETTINGS_VALUES.fontSizeValueMedium);
              useChatSettingsStore.getState().setFontSizeUnit(PRESET_CHAT_SETTINGS_VALUES.fontSizeUnit);
            }}
          >
            preset medium
          </button>
          <button
            onClick={() => {
              useChatSettingsStore.getState().setFontSizeValue(PRESET_CHAT_SETTINGS_VALUES.fontSizeValueLarge);
              useChatSettingsStore.getState().setFontSizeUnit(PRESET_CHAT_SETTINGS_VALUES.fontSizeUnit);
            }}
          >
            preset large
          </button>
        </div>
        <div className="chat-modifiers-row chat-modifiers-label-above">
          <label htmlFor="font_family">Font family</label>
          <FontPicker id="font_family" value={fontFamily} onChange={(fontFamily) => useChatSettingsStore.getState().setFontFamily(fontFamily)} />

          <button onClick={() => useChatSettingsStore.getState().setFontFamily(DEFAULT_CHAT_SETTINGS_VALUES.fontFamily)}>reset</button>
        </div>
        <div className="chat-modifiers-row chat-modifiers-label-above">
          <label htmlFor="chat_width">Overlay Width</label>
          <CSSSizePicker
            id="chat_width"
            defaultValue={DEFAULT_CHAT_SETTINGS_VALUES.widthValue}
            defaultUnit={DEFAULT_CHAT_SETTINGS_VALUES.widthUnit}
            value={widthValue}
            unit={widthUnit}
            onValueChange={(widthValue) => {
              useChatSettingsStore.getState().setWidthValue(widthValue);
            }}
            onUnitChange={(widthUnit) => {
              useChatSettingsStore.getState().setWidthUnit(widthUnit);
            }}
            cssUnits={['px', 'vw', 'em']}
          />
        </div>
        <div className="chat-modifiers-row chat-modifiers-label-above">
          <label htmlFor="chat_height">Overlay Height</label>
          <CSSSizePicker
            id="chat_height"
            defaultValue={DEFAULT_CHAT_SETTINGS_VALUES.heightValue}
            defaultUnit={DEFAULT_CHAT_SETTINGS_VALUES.heightUnit}
            value={heightValue}
            unit={heightUnit}
            onValueChange={(heightValue) => {
              useChatSettingsStore.getState().setHeightValue(heightValue);
            }}
            onUnitChange={(heightUnit) => {
              useChatSettingsStore.getState().setHeightUnit(heightUnit);
            }}
            cssUnits={['px', 'vh', 'em']}
          />
        </div>
        <div className="chat-modifiers-row">
          <input
            type="checkbox"
            id="chat_has_drop_shadow"
            checked={dropShadowEnabled}
            onChange={(event) => useChatSettingsStore.getState().setDropShadowEnabled(event.target.checked)}
          />
          <label htmlFor="chat_has_drop_shadow">Text has drop shadow</label>
        </div>
        {dropShadowEnabled && (
          <div className="chat-modifiers-row chat-modifiers-label-above">
            <label htmlFor="chat_drop_shadow">Drop shadow settings</label>
            <TextShadowPicker
              value={dropShadowSettings}
              onChange={(value) => {
                useChatSettingsStore.getState().setDropShadowSettings(value);
              }}
            />
            <button onClick={() => useChatSettingsStore.getState().setDropShadowSettings(PRESET_CHAT_SETTINGS_VALUES.dropShadowSettingsPresetSmall)}>
              preset small
            </button>
            <button onClick={() => useChatSettingsStore.getState().setDropShadowSettings(PRESET_CHAT_SETTINGS_VALUES.dropShadowSettingsPresetMedium)}>
              preset medium
            </button>
            <button onClick={() => useChatSettingsStore.getState().setDropShadowSettings(PRESET_CHAT_SETTINGS_VALUES.dropShadowSettingsPresetLarge)}>
              preset large
            </button>
            <button
              className="chat-dashboard-button_danger"
              onClick={() => useChatSettingsStore.getState().setDropShadowSettings(DEFAULT_CHAT_SETTINGS_VALUES.dropShadowSettings)}
            >
              reset to default (preset small)
            </button>
          </div>
        )}
        <div className="chat-modifiers-row">
          <input
            type="checkbox"
            id="chat_has_text_stroke"
            checked={textStrokeEnabled}
            onChange={(event) => useChatSettingsStore.getState().setTextStrokeEnabled(event.target.checked)}
          />
          <label htmlFor="chat_has_text_stroke">Text has stroke</label>
        </div>
        {textStrokeEnabled && (
          <div className="chat-modifiers-row">
            <input
              type="text"
              id="chat_text_stroke"
              value={textStrokeSettings}
              onChange={(event) => useChatSettingsStore.getState().setTextStrokeSettings(event.target.value)}
            />
            <label htmlFor="chat_text_stroke">Text stroke settings</label>
            <button onClick={() => useChatSettingsStore.getState().setTextStrokeSettings(PRESET_CHAT_SETTINGS_VALUES.textStrokeSettingsPresetThin)}>
              preset thin
            </button>
            <button onClick={() => useChatSettingsStore.getState().setTextStrokeSettings(PRESET_CHAT_SETTINGS_VALUES.textStrokeSettingsPresetMedium)}>
              preset medium
            </button>
            <button onClick={() => useChatSettingsStore.getState().setTextStrokeSettings(PRESET_CHAT_SETTINGS_VALUES.textStrokeSettingsPresetThick)}>
              preset thick
            </button>
            <button
              className="chat-dashboard-button_danger"
              onClick={() => useChatSettingsStore.getState().setTextStrokeSettings(DEFAULT_CHAT_SETTINGS_VALUES.textStrokeSettings)}
            >
              reset to default (preset thin)
            </button>
          </div>
        )}
        <div className="chat-modifiers-row">
          <input
            type="checkbox"
            id="chat_has_animated_entrance"
            checked={animatedEntry}
            onChange={(event) => useChatSettingsStore.getState().setAnimatedEntry(event.target.checked)}
          />
          <label htmlFor="chat_has_animated_entrance">Animate chat message entrance</label>
        </div>
        <div className="chat-modifiers-row">
          <input
            type="checkbox"
            id="chat_has_borders"
            checked={showBorders}
            onChange={(event) => useChatSettingsStore.getState().setShowBorders(event.target.checked)}
          />
          <label htmlFor="chat_has_borders">Show chat message borders</label>
        </div>
        <div className="chat-modifiers-row">
          <input
            type="checkbox"
            id="chat_has_avatars"
            checked={showAvatars}
            onChange={(event) => useChatSettingsStore.getState().setShowAvatars(event.target.checked)}
          />
          <label htmlFor="chat_has_avatars">Show user avatars</label>
        </div>
        <div className="chat-modifiers-row">
          <input
            type="checkbox"
            id="chat_has_colon_after_display_name"
            checked={showColonAfterDisplayName}
            onChange={(event) => useChatSettingsStore.getState().setShowColonAfterDisplayName(event.target.checked)}
          />
          <label htmlFor="chat_has_colon_after_display_name">Show colon after username</label>
        </div>
        <div className="chat-modifiers-row">
          <input
            type="checkbox"
            id="chat_disappears"
            checked={animatedExit}
            onChange={(event) => useChatSettingsStore.getState().setAnimatedExit(event.target.checked)}
          />
          <label htmlFor="chat_disappears">Messages disappear</label>
          {animatedExit && (
            <>
              after
              <input
                type="number"
                id="chat_disappears_time"
                value={secondsBeforeExit}
                onChange={(event) => useChatSettingsStore.getState().setSecondsBeforeExit(Number(event.target.value))}
              />
              seconds
              <button onClick={() => useChatSettingsStore.getState().setSecondsBeforeExit(Number(DEFAULT_CHAT_SETTINGS_VALUES.secondsBeforeExit))}>
                reset
              </button>
            </>
          )}
        </div>
        <hr />
        <div>
          <div>Send some test messages to your chat?</div>
          <div className="chat-modifiers-row">
            <input
              type="number"
              id="chat_number_of_fake_messages"
              value={numberOfFakeMessages}
              onChange={(event) => setNumberOfFakeMessages(Number(event.target.value))}
            />
            <label htmlFor="chat_number_of_fake_messages">messages</label>
            <button onClick={() => socket.sendToServer('getFakeChatMessages', numberOfFakeMessages)}>send</button>
          </div>
          <div>Send some test messages to your chat per second?</div>
          <div className="chat-modifiers-row">
            <input
              type="number"
              id="chat_number_of_fake_messages_per_second"
              value={numberOfFakeMessagesPerSecond}
              onChange={(event) => setNumberOfFakeMessagesPerSecond(Number(event.target.value))}
            />
            <label htmlFor="chat_number_of_fake_messages_per_second">messages per second</label>
            <button onClick={() => setSendFakeMessagesPerSecond(!sendFakeMessagesPerSecond)}>
              {!sendFakeMessagesPerSecond ? 'start sending' : 'stop sending'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
