import { createServer } from 'http';
import { Server } from 'socket.io';
import { getChatMessages } from './chatMessages';
import { loadBadges } from './loadBadges';
import { loadEmotes } from './loadEmotes';
import TaskModel from './models/task-model';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173'],
  },
});

export const getIO = () => io;

/**
 * Runs the socket server and listens for connections.
 * Retrieves the latest task from the database and emits it to the connected socket.
 * Listens on port 6969.
 */
export function runSocketServer() {
  io.on('connection', (socket) => {
    socket.on('getTask', async () => {
      const task = await TaskModel.findOne({}, {}, { sort: { createdAt: -1 } });
      if (task) {
        socket.emit('task', task.content);
      }
    });
    socket.on('getEmotes', async () => {
      await loadEmotes();
    });
    socket.on('getBadges', async () => {
      await loadBadges();
    });
    socket.on('setSelectedDisplayName', (displayName) => {
      getIO().emit('setSelectedDisplayName', displayName);
    });
    socket.on('getChatMessages', () => {
      getChatMessages();
    });
  });
  httpServer.listen(6969);
}
