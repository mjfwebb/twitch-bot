import { createServer } from 'http';
import { Server } from 'socket.io';
import TaskModel from './models/task-model';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: 'http://127.0.0.1:5173',
  },
});

export const getIO = () => io;

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
