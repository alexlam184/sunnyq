import { ROOM_PHASE } from './room-phase';

export type Room = {
  roomCode: string;
  phase: ROOM_PHASE;
  host: User;
  users: User[];
  question: MultipleChoice | TextInput;
};

export type User = {
  userid: string;
  username: string;
};

export type QuestionType = {
  question: string;
  remark?: string;
};

export enum CHOICE {
  A = 0,
  B,
  C,
  D,
}

export type choiceType = {
  value: CHOICE;
  content: string;
};

export interface MultipleChoice extends QuestionType {
  type: 'mc';
  choices: choiceType[];
  answer: CHOICE;
}

export interface TextInput extends QuestionType {
  type: 'input';
  answer: string;
}
