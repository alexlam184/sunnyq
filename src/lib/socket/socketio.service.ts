'use client';

import { io } from 'socket.io-client';
const hostname = process.env.NEXT_PUBLIC_SOCKETIO_HOSTNAME;
const port = process.env.NEXT_PUBLIC_SOCKETIO_PORT;
const socketio_url = `http://${hostname}:${port}`;

export const socket = io(socketio_url, {
  withCredentials: true,
  extraHeaders: {
    'my-custom-header': 'abcd',
  },
});
