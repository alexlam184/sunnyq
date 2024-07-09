import { ROOM_PHASE } from './room-phase';

export type Room = {
  roomCode: string;
  phase: ROOM_PHASE;
  host: User;
  users: User[];
  question: BaseQuestion;
  num_of_students: number;
  num_of_answered: number;
};

export type User = {
  userid: string;
  username: string;
  answer?: any;
};

export enum QUESTION {
  MultipleChoice = 'Multiple Choice',
  TextInput = 'Text Input',
  OpenEnd = 'Open End',
}

export interface BaseQuestion {
  type: QUESTION;
  question: string;
  remark?: string;
  choices?: any[]; // Only used in Multiple Questions
  answer?: any;
}

export type choice = {
  value: CHOICE;
  content: string;
};

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: QUESTION.MultipleChoice;
  choices: choice[];
  answer: CHOICE;
}

export interface OpenEndQuestion extends BaseQuestion {
  type: QUESTION.OpenEnd;
}

export interface TextInputQuestion extends BaseQuestion {
  type: QUESTION.TextInput;
  answer: string;
}

export enum CHOICE {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
}
