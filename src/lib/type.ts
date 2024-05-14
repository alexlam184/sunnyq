export type QuestionType = {
  type: 'mc' | 'input';
  question: string;
  remark?: string;
};

export enum AnsType {
  A = 0,
  B,
  C,
  D,
}

export interface MultipleChoice extends QuestionType {
  value: {
    answer: AnsType;
    choice: string[];
  };
}
export interface TextInput extends QuestionType {
  value: {
    Answer: string;
  };
}

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  hello: () => void;
}

interface InterServerEvents {
  ping: () => void;
}
