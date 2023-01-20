import './App.css';
import useStore from './store/store';
import useSocketContext from './hooks/useSocketContext';

function App() {
  const { sendToServer } = useSocketContext();
  sendToServer('getTask');
  const task = useStore((s) => s.task);
  const currentSong = useStore((s) => s.currentSong);

  return (
    <div className="current-data-wrapper">
      <div className="current-task">Task: {task}</div>
      <div className="current-song">Current song: {currentSong?.item.name}</div>
    </div>
  );
}

export default App;
