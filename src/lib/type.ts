import { ROOM_PHASE } from './room-phase';

export type Room = {
  roomCode: string;
  phase: ROOM_PHASE;
  host: User;
  users: User[];
  questions: BaseQuestion[];
  num_of_students: number;
  num_of_answered: number;
  showUserList: boolean;
  showAnswers: boolean;
  showStatistics: boolean;
};

export type User = {
  userid: string;
  username: string;
  answers?: any[];
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

export type ModalContentType = {
  title: string;
  content: string;
};
