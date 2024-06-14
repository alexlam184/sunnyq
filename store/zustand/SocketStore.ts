import { MultipleChoice } from '@/src/lib/type';
import { create } from 'zustand';

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
