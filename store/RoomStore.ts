import { ROOM_PHASE } from '@src/lib/room-phase';
import { BaseQuestion, QUESTION, Room, User } from '@/src/lib/type';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const emptyRoom: Room = {
  roomCode: '',
  phase: ROOM_PHASE.SETUP,
  users: [],
  host: { userid: '', username: '' },
  questions: [] as BaseQuestion[],
  num_of_students: 0,
  num_of_answered: 0,
  showUserList: false,
  showAnswers: false,
  showStatistics: false,
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
   * Set the current room code.
   *
   * @param {string} roomCode - The new room code to set.
   */
  setRoomCode(roomCode: string): void;
  /**
   * Set the current room phase.
   *
   * @param {ROOM_PHASE} phase - The new room phase to set.
   */
  setPhase(phase: ROOM_PHASE): void;
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
   * Sets the host of the current room.
   *
   * @param {User} host - The new host to set.
   */
  setHost: (host: User) => void;
  /**
   * Sets the current question in the room.
   *
   * @param {BaseQuestion} question - The new question to set.
   */
  setQuestions(question: BaseQuestion[]): void;
};

export const useRoomStore = create<RoomStore, any>(
  devtools((set, get) => ({
    username: '',
    userid: '',
    setUsername: (username: string) => set({ username: username }),
    setUserID: (userid: string) => set({ userid: userid }),
    room: emptyRoom,
    setRoom: (room: Room) => {
      set({ room: room });
    },
    resetRoom: () => set({ room: emptyRoom }),
    setRoomCode: (roomCode: string) => {
      get().room.roomCode = roomCode;
    },
    setPhase: (phase: ROOM_PHASE) => {
      get().room.phase = phase;
    },
    addUser: (user: User) => {
      get().room.users.push(user);
    },
    removeUser: (user: User) => {
      get().room.users.filter((u) => u.userid !== user.userid);
    },
    setHost: (host: User) => {
      get().room.host = host;
    },
    setQuestions: (questions: BaseQuestion[]) => {
      get().room.questions = questions;
    },
  }))
);
