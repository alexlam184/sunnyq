import { PAGESTATE } from '@/src/lib/enum';
import { ModalContentType } from '@/src/lib/type';
import { create } from 'zustand';

type GeneralStateStore = {
  general_modalIsOpenedState: boolean; // Host: front, createGame, inGame  |  Client: front, inGame
  general_modalContentState: ModalContentType;
  setGeneral_ModalIsOpenedState: (param: boolean) => void;
  setGeneral_ModalContentState: (title: string, content: string) => void;
  resetgeneral_modalState: () => void;
};

export const useGeneralStateStore = create<GeneralStateStore>((set) => ({
  general_modalIsOpenedState: false,
  general_modalContentState: {
    title: 'Default title',
    content: 'No content loaded.Something went wrong.',
  },
  setGeneral_ModalIsOpenedState: (isOpened: boolean) =>
    set({ general_modalIsOpenedState: isOpened }),
  setGeneral_ModalContentState: (title: string, content: string) =>
    set({
      general_modalContentState: {
        title: title,
        content: content,
      },
    }),
  resetgeneral_modalState: () =>
    set({
      general_modalIsOpenedState: false,
      general_modalContentState: {
        title: 'Default title',
        content: 'No content loaded.Something went wrong.',
      },
    }),
}));
