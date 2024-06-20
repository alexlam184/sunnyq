export enum PAGESTATE {
  front,
  createRoom,
  inGame,
  waiting,
}

export enum MESSAGE {
  CONNECTION = 'connection',
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',

  FETCH_USERID = 'user:fetch-id',

  JOIN_ROOM = 'room:join-room',
  FETCH_ROOM = 'room:fetch-request',

  FETCH_LOBBY = 'lobby:fetch-lobby',
  CREATE_ROOM = 'lobby:host-create-room',
  UPDATE_LOBBY = 'lobby:update',
}
