import React, { useCallback, useRef } from 'react';

import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';

import useStore from '../../store/store';
import socketEventHandler from './socketEventHandler';
import SocketContext from './socketContext';

interface SocketProviderProps {
  children: React.ReactNode;
}

const SocketProvider = (props: SocketProviderProps) => {
  const socket = useRef<Socket>();

  const { resetState } = useStore.getState();

  window.addEventListener('beforeunload', () => {
    if (socket.current) {
      socket.current.close();
      socket.current = undefined;
    }
  });

  const sendToServer = useCallback((route: string, data: unknown = null) => {
    if (socket.current) {
      socket.current.emit(route, data);
    }
  }, []);

  if (import.meta.env.VITE_BOT_SERVER) {
    socket.current = io(import.meta.env.VITE_BOT_SERVER);

    if (!socket.current.connected) {
      socket.current.open();
      socket.current.io.on('reconnect_attempt', (attemptNumber: number) => {
        useStore.setState({ reconnectAttempt: attemptNumber });
      });
    }

    if (socket) {
      socket.current.on('connect', () => {
        console.log('connected');
      });
      socket.current.on('connect_error', async (error: Error) => {
        if (error.message) {
          console.log(error.message);
        }
      });
      socket.current.on('disconnect', () => {
        resetState();
      });
      socketEventHandler(socket.current);
    }
  }

  return (
    <SocketContext.Provider
      value={{
        socket,
        sendToServer,
      }}
    >
      {props.children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
