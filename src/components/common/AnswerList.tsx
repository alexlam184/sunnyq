import { BaseQuestion, QUESTION, User } from '@/src/lib/type';
import React from 'react';

const AnswerList = ({
  users,
  questions,
  currentQuestionIndex,
}: {
  users: User[];
  questions: BaseQuestion[];
  currentQuestionIndex: number;
}) => {
  const answeredUsers = users.filter(
    (user) => user.answers && user.answers[currentQuestionIndex] != null
  );
  const getColorClass = (answer?: any) => {
    const currentQuestion = questions[currentQuestionIndex];
    switch (currentQuestion.type) {
      case QUESTION.MultipleChoice:
        if (answer && answer === currentQuestion.answer)
          return 'bg-green-50 border-green-200  hover:bg-green-100';
        else return 'bg-red-50 border-red-200  hover:bg-red-100';
      case QUESTION.TextInput:
        if (answer && answer === currentQuestion.answer)
          return 'bg-green-50 border-green-200  hover:bg-green-100';
        else return 'bg-red-50 border-red-200  hover:bg-red-100';
      case QUESTION.OpenEnd:
        return 'bg-gray-50 border-gray-200  hover:bg-gray-100';
    }
  };
  return (
    <div className='scroll-container overflow-y-auto h-[80vh] p-4 bg-white shadow-md rounded-lg border border-gray-300'>
      {answeredUsers.length > 0 ? (
        <ul className='space-y-2'>
          {answeredUsers.map((user, index) => (
            <li
              className={`flex flex-col space-y-1 p-3 border rounded-lg transition ${getColorClass(user.answers && user.answers[currentQuestionIndex])} max-w-[40vh]`}
              key={index}
            >
              <span className='font-semibold text-lg text-gray-800'>
                {index + 1}. {user.username}
              </span>
              <span className='text-md text-gray-600'>
                {user.answers && user.answers[currentQuestionIndex]}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className='text-lg text-gray-600'>No answer yet!</p>
      )}
    </div>
  );
};

export default AnswerList;
