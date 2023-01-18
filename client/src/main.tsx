import React from 'react';

import ReactDOM from 'react-dom/client';

import SocketProvider from './context/Socket/SocketProvider';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SocketProvider>
      <App />
    </SocketProvider>
  </React.StrictMode>
);
