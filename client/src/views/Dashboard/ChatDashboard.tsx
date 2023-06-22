import { useEffect, useState } from 'react';

import useSocketContext from '../../hooks/useSocketContext';
import { CopyButton } from '../../components/CopyButton';

const defaultHeight = '100vh';
const defaultWidth = '500px';
const defaultDisappearsTime = '10';
const defaultBackground = '#000000';
const defaultForeground = '#ffffff';

export const ChatDashboard = () => {
  const socket = useSocketContext();
  const [chatDisabledBorders, setChatDisabledBorders] = useState<boolean>(false);
  const [chatDisabledAvatars, setChatDisabledAvatars] = useState<boolean>(false);
  const [chatBackground, setChatBackground] = useState<string>(defaultBackground);
  const [chatForeground, setChatForeground] = useState<string>(defaultForeground);
  const [chatHeight, setChatHeight] = useState<string>(defaultHeight);
  const [chatWidth, setChatWidth] = useState<string>(defaultWidth);
  const [chatDisappears, setChatDisappears] = useState<boolean>(false);
  const [chatDisappearsTime, setChatDisappearsTime] = useState<string>(defaultDisappearsTime);
  const [numberOfFakeMessages, setNumberOfFakeMessages] = useState<number>(5);
  const [numberOfFakeMessagesPerSecond, setNumberOfFakeMessagesPerSecond] = useState<number>(0);
  const [sendFakeMessagesPerSecond, setSendFakeMessagesPerSecond] = useState<boolean>(false);
  const [animatedEntrance, setAnimatedEntrance] = useState<boolean>(true);

  useEffect(() => {
    if (sendFakeMessagesPerSecond && numberOfFakeMessagesPerSecond > 0) {
      const interval = setInterval(() => {
        socket.sendToServer('getFakeChatMessages', numberOfFakeMessagesPerSecond);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [sendFakeMessagesPerSecond, numberOfFakeMessagesPerSecond, socket]);

  const chatURL = new URL(`${document.location.href}chat`);

  if (chatBackground !== defaultBackground) {
    chatURL.searchParams.append('background', chatBackground);
  }
  if (chatForeground !== defaultForeground) {
    chatURL.searchParams.append('foreground', chatForeground);
  }
  if (chatDisabledAvatars === false) {
    chatURL.searchParams.append('avatars', 'false');
  }
  if (chatDisabledBorders === false) {
    chatURL.searchParams.append('borders', 'false');
  }
  if (chatHeight !== defaultHeight) {
    chatURL.searchParams.append('height', chatHeight);
  }
  if (chatWidth !== defaultWidth) {
    chatURL.searchParams.append('width', chatWidth);
  }
  if (chatDisappears) {
    chatURL.searchParams.append('disappears', 'true');
  }
  if (chatDisappears && chatDisappearsTime !== defaultDisappearsTime) {
    chatURL.searchParams.append('disappears-time', chatDisappearsTime);
  }
  if (animatedEntrance === false) {
    chatURL.searchParams.append('animated-entry', 'false');
  }

  const chatURLString = `${chatURL.protocol}${'//'}${chatURL.host}${chatURL.pathname}${chatURL.search}`;

  return (
    <>
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
          <input type="color" id="chat_background" value={chatBackground} onChange={(event) => setChatBackground(event.target.value)} />
          <label htmlFor="chat_background">Background color</label>
          <button onClick={() => setChatBackground(defaultBackground)}>reset</button>
        </div>
        <div className="chat-modifiers-row">
          <input type="color" id="chat_foreground" value={chatForeground} onChange={(event) => setChatForeground(event.target.value)} />
          <label htmlFor="chat_foreground">Foreground color</label>
          <button onClick={() => setChatForeground(defaultForeground)}>reset</button>
        </div>
        <div className="chat-modifiers-row">
          <input type="text" id="chat_width" value={chatWidth} onChange={(event) => setChatWidth(event.target.value)} />
          <label htmlFor="chat_width">Width</label>
          <button onClick={() => setChatWidth(defaultWidth)}>reset</button>
        </div>
        <div className="chat-modifiers-row">
          <input type="text" id="chat_height" value={chatHeight} onChange={(event) => setChatHeight(event.target.value)} />
          <label htmlFor="chat_height">Height</label>
          <button onClick={() => setChatHeight(defaultHeight)}>reset</button>
        </div>
        <div className="chat-modifiers-row">
          <input
            type="checkbox"
            id="chat_has_animated_entrance"
            checked={animatedEntrance}
            onChange={(event) => setAnimatedEntrance(event.target.checked)}
          />
          <label htmlFor="chat_has_animated_entrance">Animate chat message entrance</label>
        </div>
        <div className="chat-modifiers-row">
          <input
            type="checkbox"
            id="chat_has_borders"
            checked={chatDisabledBorders}
            onChange={(event) => setChatDisabledBorders(event.target.checked)}
          />
          <label htmlFor="chat_has_borders">Show chat message borders</label>
        </div>
        <div className="chat-modifiers-row">
          <input
            type="checkbox"
            id="chat_has_avatars"
            checked={chatDisabledAvatars}
            onChange={(event) => setChatDisabledAvatars(event.target.checked)}
          />
          <label htmlFor="chat_has_avatars">Show user avatars</label>
        </div>
        <div className="chat-modifiers-row">
          <input type="checkbox" id="chat_disappears" checked={chatDisappears} onChange={(event) => setChatDisappears(event.target.checked)} />
          <label htmlFor="chat_disappears">Messages disappear</label>
          {chatDisappears && (
            <>
              after
              <input
                type="number"
                id="chat_disappears_time"
                value={chatDisappearsTime}
                onChange={(event) => setChatDisappearsTime(event.target.value)}
              />
              seconds
              <button onClick={() => setChatDisappearsTime(defaultDisappearsTime)}>reset</button>
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
            <label htmlFor="chat_number_of_fake_messages">Amount</label>
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
            <label htmlFor="chat_number_of_fake_messages_per_second">Amount per second</label>
            <button onClick={() => setSendFakeMessagesPerSecond(!sendFakeMessagesPerSecond)}>
              {!sendFakeMessagesPerSecond ? 'start sending' : 'stop sending'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
