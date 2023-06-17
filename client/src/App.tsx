import { useState } from 'react';

import { Route } from 'wouter';

import { Task } from './views/Task/Task';
import { Song } from './views/Song/Song';
import { Chat } from './views/Chat/Chat';

import './App.less';

function App() {
  const [chatDisabledBorders, setChatDisabledBorders] = useState<boolean>(false);
  const [chatDisabledAvatars, setChatDisabledAvatars] = useState<boolean>(false);
  const [chatBackground, setChatBackground] = useState<string>('');

  const chatURL = new URL(`${document.location.href}chat`);

  if (chatBackground) {
    chatURL.searchParams.append('background', chatBackground);
  }
  if (chatDisabledAvatars) {
    chatURL.searchParams.append('avatars', 'false');
  }
  if (chatDisabledBorders) {
    chatURL.searchParams.append('borders', 'false');
  }

  return (
    <>
      <Route path="/chat">
        <Chat />
      </Route>
      <Route path="/song">
        <Song />
      </Route>
      <Route path="/task">
        <Task />
      </Route>
      <Route path="/">
        <div className="main">
          <h1>Twitch Bot Overlays</h1>
          <p>Make separate browser sources in your overlay for the following views:</p>
          <ul>
            <li>
              <h2>Chat</h2>
              <a target="_new" href={chatURL.href}>
                {chatURL.pathname}
                {chatURL.search}
              </a>
              <div className="chat-modifiers">
                <div className="chat-modifiers-row">
                  <input
                    type="color"
                    id="chat_background"
                    value={chatBackground || 'black'}
                    onChange={(event) => setChatBackground(event.target.value)}
                  />
                  <label htmlFor="disable_borders">Background color</label>
                  <button onClick={() => setChatBackground('')}>Clear</button>
                </div>
                <div className="chat-modifiers-row">
                  <input type="checkbox" id="chat_has_borders" value="0" onChange={(event) => setChatDisabledBorders(event.target.checked)} />
                  <label htmlFor="chat_has_borders">Disable borders</label>
                </div>
                <div className="chat-modifiers-row">
                  <input type="checkbox" id="chat_has_avatars" value="0" onChange={(event) => setChatDisabledAvatars(event.target.checked)} />
                  <label htmlFor="chat_has_avatars">Disable avatars</label>
                </div>
              </div>
            </li>
            <li>
              <h2>Current Song (through Spotify)</h2>
              <a target="_new" href="/song">
                /song
              </a>
            </li>
            <li>
              <h2>Current Task</h2>
              <a target="_new" href="/task">
                /task
              </a>
            </li>
          </ul>
        </div>
      </Route>
    </>
  );
}

export default App;
