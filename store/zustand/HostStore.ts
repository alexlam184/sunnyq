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
