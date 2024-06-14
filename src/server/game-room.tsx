import React from 'react';
import { GAME_PHASE } from '../lib/game-phase';

// TODO: Turn this into a class
export interface GameRoom {
  roomCode: string | undefined;
  users: any;
  host: any;

  round: number;
  phase: GAME_PHASE;

  isDead: any;
}
