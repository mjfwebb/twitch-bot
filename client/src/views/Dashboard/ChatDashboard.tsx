import { useState } from 'react';

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

  const chatURL = new URL(`${document.location.href}chat`);

  if (chatBackground !== defaultBackground) {
    chatURL.searchParams.append('background', chatBackground);
  }
  if (chatForeground !== defaultForeground) {
    chatURL.searchParams.append('foreground', chatForeground);
  }
  if (chatDisabledAvatars) {
    chatURL.searchParams.append('avatars', 'false');
  }
  if (chatDisabledBorders) {
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
          <input type="checkbox" id="chat_has_borders" value="0" onChange={(event) => setChatDisabledBorders(event.target.checked)} />
          <label htmlFor="chat_has_borders">Disable borders</label>
        </div>
        <div className="chat-modifiers-row">
          <input type="checkbox" id="chat_has_avatars" value="0" onChange={(event) => setChatDisabledAvatars(event.target.checked)} />
          <label htmlFor="chat_has_avatars">Disable avatars</label>
        </div>
        <div className="chat-modifiers-row">
          <input type="checkbox" id="chat_disappears" value="0" onChange={(event) => setChatDisappears(event.target.checked)} />
          <label htmlFor="chat_disappears">Disappearing messages</label>
          {chatDisappears && (
            <>
              <input
                type="number"
                id="chat_disappears_time"
                value={chatDisappearsTime}
                onChange={(event) => setChatDisappearsTime(event.target.value)}
              />
              <button onClick={() => setChatDisappearsTime(defaultDisappearsTime)}>reset</button>
              <label htmlFor="chat_disappears_time">Time before messages disappear (seconds)</label>
            </>
          )}
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
        </div>
      </div>
    </>
  );
};
