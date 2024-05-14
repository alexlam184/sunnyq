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
