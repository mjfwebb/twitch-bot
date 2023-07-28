import JSConfetti from 'js-confetti';
import type { Socket } from 'socket.io-client';

import useStore from '../../store/store';
import type { TaskMessage } from '../../twitchTypes';
import type { ChatBadge, ChatCheer, ChatEmote, ChatMessage, SpotifySong } from '../../types';

function socketEventHandler(socket: Socket) {
  socket.on('task', (data: unknown) => {
    useStore.getState().setTask(data as TaskMessage);
  });
  socket.on('currentSong', (data: unknown) => {
    useStore.getState().setCurrentSong(data as SpotifySong);
  });
  socket.on('confetti', () => {
    setTimeout(() => {
      const jsConfetti = new JSConfetti();

      jsConfetti.addConfetti();
    }, 1500);
  });
  socket.on('chatMessage', (data: unknown) => {
    useStore.getState().addChatMessage(data as ChatMessage);
  });
  socket.on('chatMessages', (data: unknown) => {
    useStore.getState().addChatMessages(data as ChatMessage[]);
  });
  socket.on('emotes', (data: Record<string, ChatEmote>) => {
    useStore.getState().addEmotes(data);
  });
  socket.on('badges', (data: Record<string, ChatBadge>) => {
    useStore.getState().addBadges(data);
  });
  socket.on('cheers', (data: Record<string, ChatCheer>) => {
    useStore.getState().addCheers(data);
  });
  socket.on('setSelectedDisplayName', (data: string) => {
    useStore.getState().setSelectedDisplayName(data);
  });
}

export default socketEventHandler;
