import { useEffect, useState } from 'react';

import { chatSearchParamsMap } from '../Chat/chatSearchParamsMap';
import { useChatSettingsStore } from '../../store/chatSettingsStore';
import useSocketContext from '../../hooks/useSocketContext';
import { DEFAULT_CHAT_SETTINGS_VALUES, PRESET_CHAT_SETTINGS_VALUES } from '../../constants';
import { TextShadowPicker } from '../../components/TextShadowPicker';
import { CopyButton } from '../../components/CopyButton/CopyButton';
import './ChatDashboard.less';
import { ChatPreview } from './ChatPreview';

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
  const height = useChatSettingsStore((s) => s.height);
  const width = useChatSettingsStore((s) => s.width);
  const animatedExit = useChatSettingsStore((s) => s.animatedExit);
  const secondsBeforeExit = useChatSettingsStore((s) => s.secondsBeforeExit);
  const animatedEntry = useChatSettingsStore((s) => s.animatedEntry);
  const dropShadowEnabled = useChatSettingsStore((s) => s.dropShadowEnabled);
  const dropShadowSettings = useChatSettingsStore((s) => s.dropShadowSettings);

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
  if (height !== DEFAULT_CHAT_SETTINGS_VALUES.height) {
    chatURL.searchParams.append(chatSearchParamsMap.height, height);
  }
  if (width !== DEFAULT_CHAT_SETTINGS_VALUES.width) {
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
          }}
        >
          <ChatPreview />
        </div>
      </div>
      <h3>Settings:</h3>
      <p>These settings will be saved on this same computer for the next time you visit this page.</p>
      <div className="chat-modifiers">
        <div className="chat-modifiers-row">
          <input
            type="color"
            id="chat_background"
            value={backgroundColor}
            onChange={(event) => useChatSettingsStore.getState().setBackgroundColor(event.target.value)}
          />
          <label htmlFor="chat_background">Background color (default is transparent)</label>
          <button onClick={() => useChatSettingsStore.getState().setBackgroundColor(DEFAULT_CHAT_SETTINGS_VALUES.backgroundColor)}>
            reset to default
          </button>
        </div>
        <div className="chat-modifiers-row">
          <input
            type="color"
            id="chat_foreground"
            value={foregroundColor}
            onChange={(event) => useChatSettingsStore.getState().setForegroundColor(event.target.value)}
          />
          <label htmlFor="chat_foreground">Foreground color</label>
          <button onClick={() => useChatSettingsStore.getState().setForegroundColor(DEFAULT_CHAT_SETTINGS_VALUES.foregroundColor)}>
            reset to default
          </button>
        </div>
        <div className="chat-modifiers-row">
          <input
            type="checkbox"
            id="chat_has_drop_shadow"
            checked={dropShadowEnabled}
            onChange={(event) => useChatSettingsStore.getState().setDropShadowEnabled(event.target.checked)}
          />
          <label htmlFor="chat_has_drop_shadow">Message content has drop shadow</label>
        </div>
        {dropShadowEnabled && (
          <div className="chat-modifiers-row">
            <TextShadowPicker
              value={dropShadowSettings}
              onChange={(value) => {
                useChatSettingsStore.getState().setDropShadowSettings(value);
              }}
            />
            <label htmlFor="chat_drop_shadow">Drop shadow settings</label>
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
          <input type="text" id="chat_width" value={width} onChange={(event) => useChatSettingsStore.getState().setWidth(event.target.value)} />
          <label htmlFor="chat_width">Width</label>
          <button onClick={() => useChatSettingsStore.getState().setWidth(DEFAULT_CHAT_SETTINGS_VALUES.width)}>reset</button>
        </div>
        <div className="chat-modifiers-row">
          <input type="text" id="chat_height" value={height} onChange={(event) => useChatSettingsStore.getState().setHeight(event.target.value)} />
          <label htmlFor="chat_height">Height</label>
          <button onClick={() => useChatSettingsStore.getState().setHeight(DEFAULT_CHAT_SETTINGS_VALUES.height)}>reset</button>
        </div>
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
