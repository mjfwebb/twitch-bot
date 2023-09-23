import React from 'react';

import ReactDOM from 'react-dom/client';

import App from './App';
import SocketProvider from './context/Socket/SocketProvider';

import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SocketProvider>
      <App />
    </SocketProvider>
  </React.StrictMode>,
);
