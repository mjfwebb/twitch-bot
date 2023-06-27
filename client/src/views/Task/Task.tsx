import { ChatImageRenderer } from '../Chat/ChatImageRenderer';
import useStore from '../../store/store';

import './Task.less';

export const Task = () => {
  const task = useStore((s) => s.task);

  if (!task) {
    return <></>;
  }

  return (
    <div className="task">
      <p>Current task:</p>
      <div>
        <ChatImageRenderer
          emotes={task.tags.emotes}
          message={task.parameters}
          offset={task.parameters.length - task.command.botCommandParams.length}
        />
      </div>
    </div>
  );
};
