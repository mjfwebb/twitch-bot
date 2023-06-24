import * as Tabs from '@radix-ui/react-tabs';

import { TaskDashboard } from './TaskDashboard';
import { SongDashboard } from './SongDashboard';
import { ChatDashboard } from './ChatDashboard';

import './Dashboard.less';

export const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1 className="dashboard-title">TwitchBot Overlays</h1>
      <p>Make separate browser sources in your overlay for the following views:</p>
      <Tabs.Root className="dashboard-tabs-root" defaultValue="chat">
        <Tabs.List className="dashboard-tabs-list" aria-label="Manage your account">
          <Tabs.Trigger className="dashboard-tabs-trigger" value="chat">
            Chat
          </Tabs.Trigger>
          <Tabs.Trigger className="dashboard-tabs-trigger" value="song">
            Song
          </Tabs.Trigger>
          <Tabs.Trigger className="dashboard-tabs-trigger" value="task">
            Task
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content className="dashboard-tabs-content" value="chat">
          <ChatDashboard />
        </Tabs.Content>
        <Tabs.Content className="dashboard-tabs-content" value="song">
          <SongDashboard />
        </Tabs.Content>
        <Tabs.Content className="dashboard-tabs-content" value="task">
          <TaskDashboard />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};
