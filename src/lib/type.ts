import { ROOM_PHASE } from './room-phase';

export type Room = {
  roomCode: string;
  phase: ROOM_PHASE;
  host: User;
  users: User[];
  question: Question;
};

export type User = {
  userid: string;
  username: string;
};

export enum QuestionType {
  MultipleChoice,
  TextInput,
}

export interface Question {
  type: QuestionType;
  question: string;
  remark?: string;
  choices?: any[]; // Only used in Multiple Questions
  answer?: any;
}

export type choice = {
  value: CHOICE;
  content: string;
};

export interface MultipleChoiceQuestion extends Question {
  type: QuestionType.MultipleChoice;
  choices: choice[];
  answer: CHOICE;
}

export interface TextInputQuestion extends Question {
  type: QuestionType.TextInput;
  answer: string;
}

export enum CHOICE {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
}
