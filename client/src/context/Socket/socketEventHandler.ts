import type { Socket } from 'socket.io-client';
import JSConfetti from 'js-confetti';

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
  socket.on('confetti', () => {
    setTimeout(() => {
      const jsConfetti = new JSConfetti();

      jsConfetti.addConfetti();
    }, 1500);
  });
}

export default socketEventHandler;
