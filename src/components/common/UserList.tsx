import { User } from '@/src/lib/type';
import React from 'react';

const UserList = ({
  num_of_students,
  users,
  currentQuestionIndex,
  themeColor = 'blue',
}: {
  num_of_students: number;
  users: User[];
  currentQuestionIndex: number;
  themeColor?: 'blue' | 'green' | 'red';
}) => {
  const textColorVariant = {
    blue: 'text-blue-700',
    green: 'text-green-700',
    red: 'text-red-700',
  };
  const bgColorVariant = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    red: 'bg-red-100',
  };
  const dotVariant = {
    blue: 'bg-blue-400 border border-blue-600 rounded-full w-5 h-5',
    green: 'bg-green-400 border border-green-600 rounded-full w-5 h-5',
    red: 'bg-red-400 border border-red-600 rounded-full w-5 h-5',
  };

  return (
    <div className='bg-white rounded-lg shadow-lg p-6 flex-grow mb-8 lg:mb-0 overflow-hidden flex flex-col'>
      <div className='w-full flex justify-between items-center mb-4'>
        <h2 className={`text-2xl font-bold ${textColorVariant[themeColor]}`}>
          Joined Players
        </h2>
        <span
          className={`font-bold text-2xl px-2 ${bgColorVariant[themeColor]} ${textColorVariant[themeColor]} rounded-lg`}
        >
          {
            users.filter(
              (user) => user.answers && user.answers[currentQuestionIndex]
            ).length
          }
          /{num_of_students}
        </span>
      </div>
      <div className='overflow-y-auto flex-grow border-t border-gray-200'>
        {' '}
        <div className='scroll-container overflow-y-auto'>
          {num_of_students > 0 ? (
            <ul className='space-y-2 mt-4'>
              {users.map((user, index) => (
                <div
                  key={index}
                  className='flex justify-between items-center mr-5'
                >
                  <li className='text-lg flex items-center' key={index}>
                    <span className='mr-2 text-gray-500'>{index + 1}.</span>
                    <span className='flex-grow'>{user.username}</span>
                  </li>
                  <div
                    className={
                      user.answers && user.answers[currentQuestionIndex]
                        ? dotVariant[themeColor]
                        : `bg-gray-300 border border-gray-500 rounded-full w-5 h-5`
                    }
                  ></div>
                </div>
              ))}
            </ul>
          ) : (
            <p className='text-lg text-gray-600 mt-4'>No users yet!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;
