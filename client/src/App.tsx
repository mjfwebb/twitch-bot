import { Route } from 'wouter';

import { Chat } from './views/Chat/Chat';
import { Dashboard } from './views/Dashboard/Dashboard';
import { Song } from './views/Song/Song';
import { Task } from './views/Task/Task';

import './App.less';

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
        <Dashboard />
      </Route>
    </>
  );
}

export default App;
