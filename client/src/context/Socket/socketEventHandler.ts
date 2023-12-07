import JSConfetti from 'js-confetti';
import type { Socket } from 'socket.io-client';

import useStore from '../../store/store';
import type { TaskMessage } from '../../twitchTypes';
import type { ChatBadge, ChatCheer, ChatEmote, ChatMessage, SpotifySong } from '../../types';

function socketEventHandler(socket: Socket) {
  socket.on('task', (data: TaskMessage) => {
    useStore.getState().setTask(data);
  });
  socket.on('currentSong', (data: SpotifySong) => {
    useStore.getState().setCurrentSong(data);
  });
  socket.on('confetti', () => {
    setTimeout(() => {
      const jsConfetti = new JSConfetti();

      jsConfetti.addConfetti();
    }, 1500);
  });
  socket.on('chatMessage', (data: ChatMessage) => {
    useStore.getState().addChatMessage(data);
  });
  socket.on('chatMessages', (data: ChatMessage[]) => {
    useStore.getState().addChatMessages(data);
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
