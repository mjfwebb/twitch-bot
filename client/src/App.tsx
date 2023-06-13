import './App.css';

import { Route } from 'wouter';

import useStore from './store/store';
import { Chat } from './components/Chat/Chat';

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
