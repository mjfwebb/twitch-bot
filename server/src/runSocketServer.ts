import { createServer } from 'http';
import { Server } from 'socket.io';
import { getChatMessages } from './chat/chatMessages';
import { getFakeChatMessages } from './chat/getFakeChatMessages';
import { sendBadges } from './chat/loadBadges';
import { sendCheers } from './chat/loadCheers';
import { sendEmotes } from './chat/loadEmotes';
import { getCurrentSpotifySong } from './handlers/spotify/fetchCurrentlyPlaying';
import { logger } from './logger';
import { Tasks } from './storage-models/task-model';

const httpServer = createServer();

let io: Server | undefined = undefined;

export function makeIO(clientPort: number) {
  io = new Server(httpServer, {
    cors: {
      origin: [`http://localhost:${clientPort}`],
    },
  });
}

export const getIO = () => {
  if (!io) {
    throw new Error('Invalid getIO call: Socket server not initialized');
  }
  return io;
};

/**
 * Runs the socket server and listens for connections.
 * Retrieves the latest task from the database and emits it to the connected socket.
 * Listens on port configred in the config file. Default is 6969.
 */
export function runSocketServer(serverPort: number) {
  const io = getIO();

  io.on('connection', (socket) => {
    socket.on('getTask', () => {
      const task = Tasks.data[0];
      if (task) {
        socket.emit('task', task.content);
      }
    });
    socket.on('getSong', () => {
      getIO().emit('currentSong', getCurrentSpotifySong());
    });
    socket.on('getEmotes', () => {
      sendEmotes();
    });
    socket.on('getBadges', () => {
      sendBadges();
    });
    socket.on('getCheers', () => {
      sendCheers();
    });
    socket.on('setSelectedDisplayName', (displayName: string) => {
      io.emit('setSelectedDisplayName', displayName);
    });
    socket.on('getChatMessages', () => {
      getChatMessages();
    });
    socket.on('getFakeChatMessages', (amount: number) => {
      getFakeChatMessages(amount);
    });
  });
  httpServer.listen(serverPort);
  logger.debug(`Localhost socket server listening on port ${serverPort}`);
}
