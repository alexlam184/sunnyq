'use client';

import { io } from 'socket.io-client';
import { MESSAGE } from '../enum';
const hostname = process.env.NEXT_PUBLIC_SOCKETIO_HOSTNAME;
const port = process.env.NEXT_PUBLIC_SOCKETIO_PORT;
const socketio_url =
  process.env.NEXT_PUBLIC_NODE_ENV == 'production'
    ? process.env.NEXT_PUBLIC_SOCKETIO_SERVER_URL!
    : `http://${hostname}:${port}`;

console.log(`Environment: ${process.env.NEXT_PUBLIC_NODE_ENV}`);
export const socket = io(socketio_url, {
  withCredentials: true,
  extraHeaders: {
    'my-custom-header': 'abcd',
  },
});

socket.on(MESSAGE.CONNECTION_ERROR, (err) => {
  alert(`Socket.io connect_error due to ${err.message}`);
});
