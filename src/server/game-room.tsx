import React from 'react';
import { GAME_PHASE } from '../lib/game-phase';

export interface GameRoom {
  roomCode: string;
  users: any;
  host: any;

  round: number;
  phase: GAME_PHASE;

  isDead: any;
}
