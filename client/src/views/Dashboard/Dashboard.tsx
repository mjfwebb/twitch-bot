import { TaskDashboard } from './TaskDashboard';
import { SongDashboard } from './SongDashboard';
import { ChatDashboard } from './ChatDashboard';

import './Dashboard.less';

export const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>TwitchBot Overlays</h1>
      <p>Make separate browser sources in your overlay for the following views:</p>
      <ul>
        <li>
          <ChatDashboard />
        </li>
        <li>
          <SongDashboard />
        </li>
        <li>
          <TaskDashboard />
        </li>
      </ul>
    </div>
  );
};
