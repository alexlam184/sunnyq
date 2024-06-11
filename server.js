const { createServer } = require('http');
const next = require('next');
const { Server } = require('socket.io');
const { instrument } = require('@socket.io/admin-ui');

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
    // ...
    socket.on('send-message', (obj) => {
      io.emit('receive-message', obj);
    });
  });

  instrument(io, {
    auth: false,
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
