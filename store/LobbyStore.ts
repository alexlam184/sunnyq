import { ROOM_PHASE } from '@/src/lib/room-phase';
import { BaseQuestion, CHOICE, QUESTION, Room, User } from '@/src/lib/type';
import { randomInt } from '@/src/lib/utils';
import { create } from 'zustand';

const ROOMS_LIMIT = 10;
const ROOM_CODE_LENGTH = 5;

type LobbyStore = {
  /**
   * Creates a set of room codes for the game.
   *
   * This is used to store and manage the state of multiple game rooms,
   * each identified by a random 5-character code.
   */
  lobby: string[];
  /**
   * Sets the current lobby state.
   */
  setLobby: (lobby: string[]) => void;
  /**
   * Add a new room code to the lobby state.
   */
  addRoomCode: (roomCode: string) => void;
  /**
   * Creates a new game room with a unique random code.
   *
   * @param {string[]} lobby - The current lobby state.
   * @returns {Room | undefined} The newly created room, or `undefined` if the maximum number of rooms has been reached.
   */
  createRoom: (lobby: string[]) => Room | undefined;
  //TODO: Add a way to remove rooms from the lobby
  removeRoom: (roomCode: string) => void;
  /**
   * Checks whether a room with a given code exists in the lobby.
   *
   * @param {string} roomCode - The 5-character code of the room to check for.
   * @returns {boolean} True if the room exists, false otherwise.
   */
  hasRoom: (roomCode: string) => boolean;
  /**
   * Checks if the lobby has reached its maximum capacity.
   *
   * @param {string[]} lobby - The current lobby state.
   * @returns {boolean} Whether or not the lobby is full.
   */
  isFull: (lobby: string[]) => boolean;
  /**
   * Resets the entire lobby, clearing all existing rooms and users.
   */
  resetLobby: () => void;
};

export const useLobbyStore = create<LobbyStore>((set, get) => ({
  lobby: [],
  setLobby: (lobby: string[]) => set({ lobby: lobby }),
  createRoom: (lobby: string[]) => {
    if (get().isFull(lobby)) {
      console.log('Lobby: Lobby is full');
      return undefined;
    }

    const room: Room = {
      roomCode: generateUniqueRoomCode(lobby),
      phase: ROOM_PHASE.WAITING,
      users: [],
      host: { userid: '', username: '' },
      questions: [] as BaseQuestion[],
      num_of_students: 0,
      num_of_answered: 0,
      showUserList: false,
      showAnswers: false,
      showStatistics: false,
    };

    console.log(`Lobby: Room: ${room.roomCode} is created.`);

    return room;
  },
  addRoomCode: (roomCode: string) => {
    if (get().isFull(get().lobby)) {
      console.log('Lobby: Lobby is full');
      return;
    }
    get().setLobby([...get().lobby, roomCode]);
    console.log(`Lobby: Room code: ${roomCode} is stored in lobby.`);
  },
  //TODO: Add a way to remove rooms from the lobby
  removeRoom: (roomCode: string) => {},
  hasRoom: (roomCode: string) => get().lobby.includes(roomCode),
  isFull: (lobby: string[]) => lobby.length >= ROOMS_LIMIT,
  resetLobby: () => get().setLobby([]),
}));

/**
 * Generates a unique room code.
 *
 * Returns a unique room code if the current number of rooms is within the limit.
 * If the limit has been reached, returns 'undefined'.
 *
 * @returns {string} The generated room code or 'undefined' if the limit has been reached.
 */
const generateUniqueRoomCode = (lobby: string[]) => {
  if (lobby.length >= ROOMS_LIMIT) return 'undefined';

  let code;
  do {
    code = '';
    for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
      code += '' + randomInt(10);
    }
  } while (lobby.includes(code)); // This loop will keep generating unique room codes until a unique one is found.

  return code;
};
