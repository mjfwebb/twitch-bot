import { createServer } from 'http';
import { Server } from 'socket.io';
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
        socket.emit('task', task.text);
      }
    });
  });
  httpServer.listen(6969);
}
