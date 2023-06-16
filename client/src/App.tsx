import './App.css';

import { Route } from 'wouter';

import { Task } from './views/Task/Task';
import { Song } from './views/Song/Song';
import { Chat } from './views/Chat/Chat';

function App() {
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
        <div className="screen">
          <p>Make separate browser sources in your overlay for the following views:</p>
          <ul>
            <li>
              <a href="/chat">Chat</a>
            </li>
            <li>
              <a href="/song">Current Song</a>
            </li>
            <li>
              <a href="/task">Current Task</a>
            </li>
          </ul>
        </div>
      </Route>
    </>
  );
}

export default App;
