import { useEffect, useState } from 'react';

import { useChatSettingsStore } from '../../store/chatSettingsStore';
import useSocketContext from '../../hooks/useSocketContext';
import { DEFAULT_CHAT_SETTINGS_VALUES } from '../../constants';
import { CopyButton } from '../../components/CopyButton';

export const ChatDashboard = () => {
  const socket = useSocketContext();
  const [numberOfFakeMessages, setNumberOfFakeMessages] = useState<number>(5);
  const [numberOfFakeMessagesPerSecond, setNumberOfFakeMessagesPerSecond] = useState<number>(0);
  const [sendFakeMessagesPerSecond, setSendFakeMessagesPerSecond] = useState<boolean>(false);
  const backgroundColor = useChatSettingsStore((s) => s.backgroundColor);
  const foregroundColor = useChatSettingsStore((s) => s.foregroundColor);
  const showAvatars = useChatSettingsStore((s) => s.showAvatars);
  const showBorders = useChatSettingsStore((s) => s.showBorders);
  const height = useChatSettingsStore((s) => s.height);
  const width = useChatSettingsStore((s) => s.width);
  const disappears = useChatSettingsStore((s) => s.disappears);
  const disappearsTime = useChatSettingsStore((s) => s.disappearsTime);
  const animatedEntry = useChatSettingsStore((s) => s.animatedEntry);
  const dropShadow = useChatSettingsStore((s) => s.dropShadow);
  const dropShadowColor = useChatSettingsStore((s) => s.dropShadowColor);

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
    chatURL.searchParams.append('background', backgroundColor);
  }
  if (foregroundColor !== DEFAULT_CHAT_SETTINGS_VALUES.foregroundColor) {
    chatURL.searchParams.append('foreground', foregroundColor);
  }
  if (showAvatars === false) {
    chatURL.searchParams.append('avatars', 'false');
  }
  if (showBorders === false) {
    chatURL.searchParams.append('borders', 'false');
  }
  if (height !== DEFAULT_CHAT_SETTINGS_VALUES.height) {
    chatURL.searchParams.append('height', height);
  }
  if (width !== DEFAULT_CHAT_SETTINGS_VALUES.width) {
    chatURL.searchParams.append('width', width);
  }
  if (disappears) {
    chatURL.searchParams.append('disappears', 'true');
  }
  if (disappears && disappearsTime !== DEFAULT_CHAT_SETTINGS_VALUES.disappearsTime) {
    chatURL.searchParams.append('disappears-time', String(disappearsTime));
  }
  if (animatedEntry === false) {
    chatURL.searchParams.append('animated-entry', 'false');
  }
  if (dropShadow) {
    chatURL.searchParams.append('drop-shadow', 'true');
  }
  if (dropShadow && dropShadowColor !== DEFAULT_CHAT_SETTINGS_VALUES.dropShadowColor) {
    chatURL.searchParams.append('drop-shadow-color', dropShadowColor);
  }

  const chatURLString = `${chatURL.protocol}${'//'}${chatURL.host}${chatURL.pathname}${chatURL.search}`;

  return (
    <div className="chat-dashboard">
      <h2>Chat</h2>
      <p>When you change options, copy the new version of the link and update your browser source.</p>
      <div className="link">
        <a target="_new" href={chatURL.href}>
          {chatURLString}
        </a>
      </div>
      <CopyButton textToCopy={chatURLString} />
      <div className="chat-modifiers">
        <div className="chat-modifiers-row">
          <input
            type="color"
            id="chat_background"
            value={backgroundColor}
            onChange={(event) => useChatSettingsStore.getState().setBackgroundColor(event.target.value)}
          />
          <label htmlFor="chat_background">Background color (default is transparent)</label>
          <button onClick={() => useChatSettingsStore.getState().setBackgroundColor(DEFAULT_CHAT_SETTINGS_VALUES.backgroundColor)}>reset</button>
        </div>
        <div className="chat-modifiers-row">
          <input
            type="color"
            id="chat_foreground"
            value={foregroundColor}
            onChange={(event) => useChatSettingsStore.getState().setForegroundColor(event.target.value)}
          />
          <label htmlFor="chat_foreground">Foreground color</label>
          <button onClick={() => useChatSettingsStore.getState().setForegroundColor(DEFAULT_CHAT_SETTINGS_VALUES.foregroundColor)}>reset</button>
        </div>
        <div className="chat-modifiers-row">
          <input
            type="checkbox"
            id="chat_has_drop_shadow"
            checked={dropShadow}
            onChange={(event) => useChatSettingsStore.getState().setDropShadow(event.target.checked)}
          />
          <label htmlFor="chat_has_drop_shadow">Message content has drop shadow</label>
        </div>
        {dropShadow && (
          <div className="chat-modifiers-row">
            <input
              type="color"
              id="chat_drop_shadow"
              value={dropShadowColor}
              onChange={(event) => useChatSettingsStore.getState().setDropShadowColor(event.target.value)}
            />
            <label htmlFor="chat_drop_shadow">Drop shadow color</label>
            <button onClick={() => useChatSettingsStore.getState().setDropShadowColor(DEFAULT_CHAT_SETTINGS_VALUES.dropShadowColor)}>reset</button>
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
            id="chat_disappears"
            checked={disappears}
            onChange={(event) => useChatSettingsStore.getState().setDisappears(event.target.checked)}
          />
          <label htmlFor="chat_disappears">Messages disappear</label>
          {disappears && (
            <>
              after
              <input
                type="number"
                id="chat_disappears_time"
                value={disappearsTime}
                onChange={(event) => useChatSettingsStore.getState().setDisappearsTime(Number(event.target.value))}
              />
              seconds
              <button onClick={() => useChatSettingsStore.getState().setDisappearsTime(Number(DEFAULT_CHAT_SETTINGS_VALUES.disappearsTime))}>
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
