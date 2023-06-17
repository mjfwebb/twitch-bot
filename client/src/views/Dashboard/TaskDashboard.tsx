import { CopyButton } from '../../components/CopyButton';

export const TaskDashboard = () => {
  const songURLString = `${document.location.href}task`;

  return (
    <>
      <h2>Current Task</h2>
      <a target="_new" href="/task">
        {songURLString}
      </a>
      <CopyButton textToCopy={songURLString} />
    </>
  );
};
