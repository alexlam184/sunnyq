import { PAGESTATE } from '@/src/lib/enum';
import { create } from 'zustand';

type PageStateStore = {
  pageState: PAGESTATE; // Host: front, createGame, inGame  |  Client: front, inGame
  setPageState: (param: PAGESTATE) => void;
  resetPageState: () => void;
};

export const usePageStateStore = create<PageStateStore>((set) => ({
  pageState: PAGESTATE.front,
  setPageState: (param: PAGESTATE) => set({ pageState: param }),
  resetPageState: () => set({ pageState: PAGESTATE.front }),
}));
