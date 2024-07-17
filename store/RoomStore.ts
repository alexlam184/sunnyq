import { ROOM_PHASE } from '@src/lib/room-phase';
import { BaseQuestion, QUESTION, Room, User } from '@/src/lib/type';
import { create } from 'zustand';

const emptyRoom: Room = {
  roomCode: '',
  phase: ROOM_PHASE.SETUP,
  users: [],
  host: { userid: '', username: '' },
  question: {
    type: QUESTION.MultipleChoice,
    question: '',
    remark: '',
  },
  num_of_students: 0,
  num_of_answered: 0,
};

type RoomStore = {
  /**
   * Get the username.
   */
  username: string;
  /**
   * Get the userid.
   */
  userid: string;
  /**
   * Set the username.
   */
  setUsername: (username: string) => void;
  /**
   * Set the userid.
   */
  setUserID: (userid: string) => void;
  /**
   * Get the current room.
   */
  room: Room;
  /**
   * Set the current room.
   */
  setRoom: (room: Room) => void;
  /**
   * Reset the current room.
   */
  resetRoom: () => void;
  /**
   * Get the current room code.
   */
  getRoomCode: () => string;
  /**
   * Set the current room code.
   *
   * @param {string} roomCode - The new room code to set.
   */
  setRoomCode(roomCode: string): void;

  /**
   * Get the current room  phase.
   */
  getPhase: () => ROOM_PHASE;
  /**
   * Set the current room phase.
   *
   * @param {ROOM_PHASE} phase - The new room phase to set.
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
  /**
   * Gets the host of the current room.
   *
   * @returns {User} - The current host.
   */
  getHost: () => User;
  /**
   * Sets the host of the current room.
   *
   * @param {User} host - The new host to set.
   */
  setHost: (host: User) => void;
  /**
   * Gets the current question in the room.
   *
   * @returns {BaseQuestion} - The current question.
   */
  getQuestion: () => BaseQuestion;
  /**
   * Sets the current question in the room.
   *
   * @param {BaseQuestion} question - The new question to set.
   */
  setQuestion(question: BaseQuestion): void;
};

export const useRoomStore = create<RoomStore>((set, get) => ({
  username: '',
  userid: '',
  setUsername: (username: string) => set({ username: username }),
  setUserID: (userid: string) => set({ userid: userid }),
  room: emptyRoom,
  setRoom: (room: Room) => set({ room: room }),
  resetRoom: () => set({ room: emptyRoom }),
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
  getQuestion: () => get().room.question,
  setQuestion: (question: BaseQuestion) => {
    const _room = get().room;
    _room.question = question;
    get().setRoom(_room);
  },
}));
