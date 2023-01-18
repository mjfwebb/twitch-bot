import type { Socket } from 'socket.io-client';

import useStore from '../../store/store';

function socketEventHandler(socket: Socket) {
  socket.on('task', (data: unknown) => {
    if (typeof data === 'string') {
      useStore.getState().setTask(data);
    }
  });
}

export default socketEventHandler;
