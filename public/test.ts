import { AnsType, MultipleChoice } from '@/src/lib/type';

let questionlist: MultipleChoice[] = [
  {
    type: 'mc',
    question: 'What is apple?',
    value: {
      answer: AnsType.A,
      choice: ['fruit', 'transport', 'cloth', 'icq'],
    },
  },
  {
    type: 'mc',
    question: 'What is the capital of France?',
    value: {
      answer: AnsType.C,
      choice: ['London', 'Berlin', 'Paris', 'Rome'],
    },
  },
  {
    type: 'mc',
    question: 'What is the chemical symbol for water?',
    value: {
      answer: AnsType.B,
      choice: ['H2O', 'CO2', 'O2', 'H2SO4'],
    },
  },
  {
    type: 'mc',
    question: 'What is the largest planet in our solar system?',
    value: {
      answer: AnsType.D,
      choice: ['Mercury', 'Venus', 'Earth', 'Jupiter'],
    },
  },
];

export default questionlist;
