import { randomInt } from 'crypto';
import { GameRoom } from './game-room';
import { GAME_PHASE } from '../lib/game-phase';
import { useMap } from '../hook/useMap';

const [rooms, roomsActions] = useMap<string, GameRoom>();
const ROOMS_LIMIT = 100;
const ROOM_CODE_LENGTH = 5;

// This constant is the delay in milliseconds before a room is torn down.
// If a room does not get any players within this time limit, it will be removed from the list of rooms.
// Default value: 60 seconds (60000 ms)
const TEARDOWN_DELAY_MS = 60000;

/**
 * Returns the GameRoom instance corresponding to the given room code.
 *
 * @param {string} roomCode - The unique identifier for a game room.
 * @returns {GameRoom | undefined} The GameRoom instance, or undefined if no room is found with the given code.
 */
const getRoomByCode = (roomCode: string) => {
  return rooms.get(roomCode);
};

/**
 * Triggers the delayed teardown of a room.
 *
 * @param {GameRoom} room - The room object to be torn down.
 */
const triggerDelayedRoomTeardown = (room: GameRoom) => {
  setTimeout(() => {
    // ensure room really is dead and hasn't already been torn down
    if (getRoomByCode(room.roomCode) && room.isDead()) {
      teardownRoom(room);
    }
    // Check if the environment is not set to 'production', then log a cancellation message.
    else if (process.env.NODE_ENV !== 'production') {
      console.log(`Cancel teardown for room-${room.roomCode}`);
    }
  }, TEARDOWN_DELAY_MS);
};

/**
 * Teardowns a room after it has been marked as dead.
 *
 * @param {GameRoom} room - The room object to be torn down.
 */
const teardownRoom = (room: GameRoom) => {
  roomsActions.remove(room.roomCode);
  console.log(
    `Rm${room.roomCode} teardown. Last round: ${room.round}. Room count: ${rooms.size}`
  );
};

/**
 * Generates a unique room code.
 *
 * Returns a unique room code if the current number of rooms is within the limit.
 * If the limit has been reached, returns "undefined".
 *
 * @returns {string} The generated room code or "undefined" if the limit has been reached.
 */
const generateUniqueRoomCode = () => {
  if (isFull()) {
    return 'undefined';
  }

  let code;
  do {
    code = '';
    for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
      code += '' + randomInt(10);
    }
  } while (rooms.has(code)); // This loop will keep generating unique room codes until a unique one is found.

  return code;
};

/**
 * Checks if the lobby has reached its maximum capacity.
 *
 * @returns {boolean} Whether or not the lobby is full.
 */
const isFull = () => {
  return rooms.size >= ROOMS_LIMIT;
};

/**
 * Creates a new room in the lobby.
 *
 * If the lobby has reached its maximum capacity, returns undefined.
 *
 * @returns {GameRoom | undefined} The newly created room object, or undefined if the lobby is full
 */
const createRoom = () => {
  if (isFull()) {
    return undefined;
  }
  const code = generateUniqueRoomCode();
  const rm: GameRoom = {
    roomCode: code,
    users: [],
    host: undefined,
    round: 0,
    phase: GAME_PHASE.SETUP,
    isDead: undefined,
  };
  roomsActions.set(code, rm);
  console.log(`Rm${rm.roomCode} created. Room count: ${rooms.size}`);
  return rm;
};

export {
  createRoom,
  getRoomByCode,
  triggerDelayedRoomTeardown,
  teardownRoom,
  isFull,
};
