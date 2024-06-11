import { CONNECTION_STATE } from '@/src/lib/connection-state';
import { MultipleChoice, QuestionType } from '@/src/lib/type';
import { create } from 'zustand';

type HostStore = {
  game: string; // idle,create,lobby,start
  setGame: (param: string) => void;
  resetGame: () => void;
};

export const useHostStore = create<HostStore>((set) => ({
  game: 'idle',
  setGame: (param: string) => set({ game: param }),
  resetGame: () => set({ game: 'idle' }),
}));

type SocketStore = {
  username: string;
  player: string;
  setPlayer: (param: string) => void;
  allPlayers: string[];
  setAllPlayers: (players: string[]) => void;
  addPlayer: (players: string) => void;
  questions: MultipleChoice[];
};

export const useSocketStore = create<SocketStore>((set) => ({
  username: 'Tommy',
  player: '',
  setPlayer: (param: string) => set({ player: param }),
  allPlayers: [],
  setAllPlayers: (playersName: string[]) => set({ allPlayers: playersName }),
  addPlayer: (playerName: string) =>
    set((state) => ({
      allPlayers: [...state.allPlayers, playerName],
    })),
  questions: [],
}));

type GameStore = {
  username: string;
  setUsername: (param: string) => void;
  gameState: any;
  createWarning: string | undefined;
  joinWarning: string | undefined;
  gameConnection: CONNECTION_STATE;
  setGameConnection: (param: CONNECTION_STATE) => void;
};

export const useGameStore = create<GameStore>((set) => ({
  username: localStorage.username || '',
  setUsername: (param: string) => {
    localStorage.username = param;
    set({ username: param });
  },
  gameState: undefined,
  createWarning: undefined,
  joinWarning: undefined,
  gameConnection: CONNECTION_STATE.DISCONNECT,
  setGameConnection: (param: CONNECTION_STATE) => {
    set({ gameConnection: param });
  },
}));
