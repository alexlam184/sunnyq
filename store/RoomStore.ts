import { ROOM_PHASE } from '@src/lib/room-phase';
import { Room, User } from '@/src/lib/type';
import { create } from 'zustand';

type RoomStore = {
  /**
   * Get the current room.
   */
  room: Room;
  /**
   * Set the current room.
   */
  setRoom: (room: Room) => void;
  /**
   * Get the current room code.
   */
  getRoomCode: () => string;
  /**
   * Set the current room code.
   *
   * @param {string} roomCode - The new room code to set, or `undefined` if not provided.
   */
  setRoomCode(roomCode: string): void;

  /**
   * Get the current room  phase.
   */
  getPhase: () => ROOM_PHASE;
  /**
   * Set the current room phase.
   *
   * @param {ROOM_PHASE} phase - The new room phase to set, or `undefined` if not provided.
   */
  setPhase(phase: ROOM_PHASE): void;

  /**
   * Gets the list of users in the current room.
   */
  getUsers: () => User[];

  /**
   * Adds a user to the list of users in the current room.
   *
   * @param {User} user - The user to add.
   */
  addUser(user: User): void;

  /**
   * Removes a user from the list of users in the current room.
   *
   * @param {User} user - The user to remove.
   */
  removeUser(user: User): void;
  getHost: () => User;
  setHost(host: User): void;
};

export const useRoomStore = create<RoomStore>((set, get) => ({
  room: {
    roomCode: '',
    phase: ROOM_PHASE.SETUP,
    users: [],
    host: { userid: '', username: '' },
  },
  setRoom: (room: Room) => set({ room: room }),
  getRoomCode: () => get().room.roomCode,
  setRoomCode: (roomCode: string) => {
    const _room = get().room;
    _room.roomCode = roomCode;
    get().setRoom(_room);
  },
  getPhase: () => get().room.phase,
  setPhase: (phase: ROOM_PHASE) => {
    const _room = get().room;
    _room.phase = phase;
    get().setRoom(_room);
  },
  getUsers: () => get().room.users,
  addUser: (user: User) => {
    const _room = get().room;
    _room.users.push(user);
    get().setRoom(_room);
  },
  removeUser: (user: User) => {
    const _room = get().room;
    _room.users.filter((u) => u.userid !== user.userid);
    get().setRoom(_room);
  },
  getHost: () => get().room.host,
  setHost: (host: User) => {
    const _room = get().room;
    _room.host = host;
    get().setRoom(_room);
  },
}));
