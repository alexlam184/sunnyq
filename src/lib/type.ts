import { ROOM_PHASE } from './room-phase';

export type Room = {
  roomCode: string;
  phase: ROOM_PHASE;
  host: User;
  users: User[];
};

export type User = {
  userid: string;
  username: string;
};
