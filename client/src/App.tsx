import './App.css';

import { Route } from 'wouter';

import { Chat } from './views/Chat/Chat';
import useStore from './store/store';

function App() {
  const task = useStore((s) => s.task);
  const currentSong = useStore((s) => s.currentSong);

  return (
    <>
      <Route path="/chat">
        <Chat />
      </Route>
      <Route path="/">
        <div className="screen">
          <div className="current-data-wrapper">
            <div className="current-task">Task: {task}</div>
            <div className="current-song">Current song: {currentSong?.item.name}</div>
          </div>
        </div>
      </Route>
    </>
  );
}

export default App;
