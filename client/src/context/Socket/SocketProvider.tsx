import React, { useCallback, useEffect, useRef } from 'react';

import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';

import useStore from '../../store/store';
import SocketContext from './socketContext';
import socketEventHandler from './socketEventHandler';

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

  useEffect(() => {
    function onConnectError(error: Error) {
      if (error.message) {
        console.log(error.message);
      }
    }

    function onDisconnect() {
      resetState();
    }

    if (import.meta.env.VITE_BOT_SERVER) {
      socket.current = io(import.meta.env.VITE_BOT_SERVER, {
        autoConnect: false,
      });
      if (!socket.current.connected) {
        socket.current.open();
        socket.current.io.on('reconnect_attempt', (attemptNumber: number) => {
          useStore.setState({ reconnectAttempt: attemptNumber });
        });
      }

      if (socket) {
        if (socket.current) {
          socket.current.on('connect_error', onConnectError);
          socket.current.on('disconnect', onDisconnect);
          socket.current.on('connect', () => {
            sendToServer('getTask');
            sendToServer('getSong');
            sendToServer('getEmotes');
            sendToServer('getBadges');
            sendToServer('getCheers');
            sendToServer('getChatMessages');
          });
        }

        socketEventHandler(socket.current);
      }
    }
    return function cleanup() {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [resetState, sendToServer]);

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
