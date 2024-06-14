import { GAME_PHASE } from './game-phase';

export type GameState = {
  roomCode: string | undefined;
  users: any[];
  phase: GAME_PHASE | undefined;

  getUsernames: () => string[];
  adoptJson: (json: any) => any;
  findUser: (username: string) => any;
};

export const generateClientGameState = () => {
  const gameState: GameState = {
    roomCode: undefined,
    users: [],
    phase: undefined,

    getUsernames() {
      return this.users.map((u: any) => u.name);
    },
    adoptJson(json: any) {
      return Object.assign(this, json);
    },
    findUser(username: string) {
      return this.users.find((u: any) => u.name === username);
    },
  };
  return gameState;
};
