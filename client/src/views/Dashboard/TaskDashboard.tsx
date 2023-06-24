import { CopyButton } from '../../components/CopyButton/CopyButton';

export const TaskDashboard = () => {
  const songURLString = `${document.location.href}task`;

  return (
    <div className="task-dashboard">
      <h2>Current Task</h2>
      <div className="link">
        <a target="_new" href="/task">
          {songURLString}
        </a>
      </div>
      <CopyButton textToCopy={songURLString} />
    </div>
  );
};
