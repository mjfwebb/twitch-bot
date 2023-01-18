import { createContext } from 'react';

import type { Socket } from 'socket.io-client';

const SocketContext = createContext<
  | {
      socket: React.MutableRefObject<Socket | undefined>;
      sendToServer: (route: string, data?: unknown) => void;
    }
  | undefined
>(undefined);

export default SocketContext;
