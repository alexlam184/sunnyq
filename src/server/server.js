import { createServer } from 'http';
import next from 'next';
import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
import { codetoRoomMap } from './lobby.js';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: ['https://admin.socket.io'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`Server: user connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`Server: user disconnected: ${socket.id}`);
    });

    socket.on('user:fetch-id', (callback) => {
      callback(socket.id);
      console.log(`Server: User ID ${socket.id} fetched.`);
    });

    socket.on('lobby:fetch-lobby', (callback) => {
      callback(Array.from(codetoRoomMap.keys()));
      console.log(`Server: Lobby fetched.`);
    });

    socket.on('lobby:host-create-room', ({ roomCode, room }) => {
      codetoRoomMap.set(roomCode, room);
      socket.join(roomCode); // Host join the room
      console.log(`Server: Room ${roomCode} was created.`);
    });

    socket.on('room:fetch-room', (roomCode, callback) => {
      callback(codetoRoomMap.get(roomCode));
      console.log(`Server: Room fetched.`);
    });

    socket.on('room:join-room', ({ roomCode, user }) => {
      if (!codetoRoomMap.has(roomCode)) {
        console.log(`Room doesn't exist`);
        return;
      }
      // Join socketIO room
      socket.join(roomCode);

      // Get room
      const room = codetoRoomMap.get(roomCode);

      // Update Room
      room.users.push(user);
      room.num_of_students++;

      // Fetch other users in the room
      // use fetching room right now
      // socket.to(roomCode).emit('room:fetch-request', 'add-user', user);
      socket.to(roomCode).emit('room:fetch-request', 'fetch-room', room);

      console.log(`Server: user ${socket.id} has joined room ${roomCode}`);
    });

    socket.on('room:leave-room', ({ roomCode }) => {
      socket.leave(roomCode);
      console.log(`Server: user ${socket.id} left room ${roomCode}`);
    });

    socket.on('room:submit-answer', ({ roomCode, userid, answer }) => {
      if (!codetoRoomMap.has(roomCode)) {
        console.log(`Room doesn't exist`);
        return;
      }
      // Get room
      const room = codetoRoomMap.get(roomCode);

      // Get user
      const user = room.users.find((user) => userid == user.userid);
      if (!user) {
        console.log(`Player doesn't exist`);
        return;
      }

      // Update room
      user.answer = answer;
      room.num_of_answered++;

      // Fetch other users in the room
      socket.to(roomCode).emit('room:fetch-request', 'fetch-room', room);
    });
  });

  instrument(io, {
    auth: false,
    mode: 'development',
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
