import type { Socket } from 'socket.io-client';

import type { SpotifySong } from '../../types';
import useStore from '../../store/store';

function socketEventHandler(socket: Socket) {
  socket.on('task', (data: unknown) => {
    if (typeof data === 'string') {
      useStore.getState().setTask(data);
    }
  });
  socket.on('currentSong', (data: unknown) => {
    useStore.getState().setCurrentSong(data as unknown as SpotifySong);
  });
}

export default socketEventHandler;
