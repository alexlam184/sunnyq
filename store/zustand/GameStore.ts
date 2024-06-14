import { GameState, generateClientGameState } from '@/src/lib/client-game';
import { CONNECTION_STATE } from '@/src/lib/connection-state';
import { USERNAMEVALIDATIONWARNING } from '@/src/lib/constants';
import { GAME_PHASE } from '@/src/lib/game-phase';
import { MESSAGE } from '@/src/lib/message';
import { validateUsername } from '@/src/lib/utils';
import { VIEW } from '@/src/lib/view';
import { WARNING } from '@/src/lib/warning';
import { socket } from '@src/lib/socket/socket';
import { create } from 'zustand';

type GameStore = {
  username: string;
  setUsername: (param: string) => void;

  view: VIEW;
  previousView: VIEW;
  setView: (param: VIEW) => void;

  gameState: GameState | undefined;
  setGameState: (param: any) => void;

  createWarning: string | undefined;
  joinWarning: string | undefined;
  setWarning: (param1: WARNING, param2: string | undefined) => void;

  gameConnection: CONNECTION_STATE;
  setGameConnection: (param: CONNECTION_STATE) => void;

  submitCreateGame: (param: string) => boolean;
  submitJoinGame: (param1: string, param2: string) => boolean;
  submitLeaveGame: () => void;
  submitStartGame: () => void;
  submitNextRound: () => void;
  submitReturnToSetup: () => void;
};

export const useGameStore = create<GameStore>((set) => ({
  username: localStorage.username || '',
  setUsername: (param: string) => {
    set({ username: param });
    localStorage.username = param;
  },

  view: VIEW.HOME,
  previousView: VIEW.HOME,
  setView(param: VIEW) {
    set({ previousView: this.view });
    set({ view: param });
  },

  gameState: undefined,
  setGameState(param: any) {
    if (param == undefined) {
      set({ gameState: undefined });
      this.setGameConnection(CONNECTION_STATE.DISCONNECT);
      this.setView(VIEW.HOME);
      return;
    }
    this.setGameConnection(CONNECTION_STATE.CONNECT);

    if (this.gameState == undefined) {
      set({ gameState: generateClientGameState() });
    }
    this.gameState!.adoptJson(param);

    switch (this.gameState!.phase) {
      case GAME_PHASE.SETUP:
        this.setView(VIEW.SETUP);
        break;
      case GAME_PHASE.PLAY:
      case GAME_PHASE.VOTE:
        this.setView(VIEW.GAME);
        break;
    }
  },

  createWarning: undefined,
  joinWarning: undefined,
  setWarning(param1: WARNING, param2: string | undefined) {
    switch (param1) {
      case WARNING.createWarning:
        set({ createWarning: param2 });
        break;
      case WARNING.joinWarning:
        set({ joinWarning: param2 });
        break;
    }
  },

  gameConnection: CONNECTION_STATE.DISCONNECT,
  setGameConnection: (param: CONNECTION_STATE) => {
    set({ gameConnection: param });
  },

  submitCreateGame(param: string) {
    param = param.trim();

    if (!validateUsername(param)) {
      this.setWarning(WARNING.createWarning, USERNAMEVALIDATIONWARNING);
      return false;
    }

    this.setWarning(WARNING.createWarning, undefined);
    socket.emit(MESSAGE.CREATE_ROOM, {
      username: param,
    });
    return true;
  },

  submitJoinGame(param1: string, param2: string) {
    param2 = param2.trim();
    if (!validateUsername(param2)) {
      this.setWarning(WARNING.joinWarning, USERNAMEVALIDATIONWARNING);
      return false;
    }

    this.setWarning(WARNING.joinWarning, undefined);
    socket.emit(MESSAGE.JOIN_ROOM, {
      roomCode: param1,
      username: param2,
    });
    return true;
  },
  submitLeaveGame() {
    socket.emit(MESSAGE.LEAVE_ROOM, {});
  },
  submitStartGame() {
    socket.emit(MESSAGE.START_GAME, {});
  },
  submitNextRound() {
    socket.emit(MESSAGE.NEXT_ROUND, {});
  },
  submitReturnToSetup() {
    socket.emit(MESSAGE.RETURN_TO_SETUP, {});
  },
}));
