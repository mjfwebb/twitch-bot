import './App.css';
import useStore from './store/store';
import useSocketContext from './hooks/useSocketContext';

function App() {
  const { sendToServer } = useSocketContext();
  sendToServer('getTask');
  const task = useStore((s) => s.task);

  return (
    <div className="current-task-wrapper">
      <span className="current-task">Task: {task}</span>
    </div>
  );
}

export default App;
