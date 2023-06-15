import type { Socket } from 'socket.io-client';
import JSConfetti from 'js-confetti';

import type { ChatBadge, ChatEmote, ChatMessage, SpotifySong } from '../../types';
import useStore from '../../store/store';
import { usePersistentStore } from '../../store/persistentStore';

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
  socket.on('chatMessage', (data: unknown) => {
    usePersistentStore.getState().addChatMessage(data as unknown as ChatMessage);
  });
  socket.on('emotes', (data: Record<string, ChatEmote>) => {
    useStore.getState().addEmotes(data);
  });
  socket.on('badges', (data: Record<string, ChatBadge>) => {
    useStore.getState().addBadges(data);
  });
  socket.on('setSelectedDisplayName', (data: string) => {
    useStore.getState().setSelectedDisplayName(data);
  });
}

export default socketEventHandler;
