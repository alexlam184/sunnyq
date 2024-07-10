'use client';
import { choice, CHOICE, QUESTION } from '@/src/lib/type';
import { useRoomStore } from '@/store/RoomStore';
import { useState } from 'react';
import Button from '../ui/Button';
import { socket } from '@/src/lib/socket/socketio.service';
import { MESSAGE } from '@/src/lib/enum';

export default function ClientIdle() {
  const { getHost, getUsers, getQuestion, username, getRoomCode, userid } =
    useRoomStore();
  const [selectedChoice, setSelectedChoice] = useState<CHOICE | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [reminded, setReminded] = useState<boolean>(false);

  const handleChoiceSelect = (choice: CHOICE) => {
    if (submitted) return;
    setSelectedChoice(choice);
  };

  const handleSubmit = () => {
    if (submitted) return;
    if (!selectedChoice) {
      setReminded(true);
      return;
    }
    const roomCode: string = getRoomCode();

    const answer: string = selectedChoice; // socket IO can only receive string
    socket.emit(MESSAGE.SUBMIT_ANSWER, { roomCode, userid, answer });
    setSubmitted(true);
    setReminded(false);
  };

  return (
    <div className='flex min-h-screen bg-gradient-to-b from-green-100 to-green-200 text-gray-800 p-8 flex-col md:flex-row'>
      <div className='w-full md:w-80 flex flex-col order-2 md:order-1'>
        <div className='bg-white rounded-lg shadow-lg p-6 mb-8 flex-none'>
          <h2 className='text-2xl font-bold mb-4 text-black'>
            Username:{' '}
            <span className='font-semibold text-black'>{username}</span>
          </h2>
          <h2 className='text-2xl font-bold mb-4 text-black'>
            Teacher:{' '}
            <span className='font-semibold text-black'>
              {getHost().username}
            </span>
          </h2>
        </div>

        <div className='bg-white rounded-lg shadow-lg p-6 flex-grow'>
          <h2 className='text-2xl font-bold mb-4 text-green-600'>
            Joined Players
          </h2>
          <div className='scroll-container overflow-y-auto max-h-[65vh]'>
            {getUsers().length > 0 ? (
              <ul className='space-y-2'>
                {getUsers().map((user, index) => (
                  <li className='text-lg' key={index}>
                    {index + 1}. {user.username}
                  </li>
                ))}
              </ul>
            ) : (
              <p className='text-lg text-gray-600'>No users yet!</p>
            )}
          </div>
        </div>
      </div>

      <div className='flex-grow max-w-3xl bg-white rounded-lg shadow-lg p-8 md:ml-8 order-1 md:order-2 mb-8 md:mb-0'>
        <h1 className='text-4xl font-bold mb-6 text-center text-green-600'>
          Client Dashboard
        </h1>

        <div className='bg-gray-100 p-6 rounded-lg flex-grow'>
          <h2 className='text-2xl font-bold mb-4 text-green-600'>Question</h2>
          <p className='text-xl mb-2'>{getQuestion().question}</p>
          <p className='text-sm text-gray-500 mb-4'>{getQuestion().remark}</p>

          {getQuestion().type === QUESTION.MultipleChoice && (
            <div className='space-y-4'>
              {getQuestion().choices?.map((choice: choice) => (
                <div
                  key={choice.value}
                  className={`flex items-center text-lg cursor-pointer ${
                    selectedChoice === choice.value
                      ? 'bg-green-200'
                      : 'bg-white'
                  } p-2 rounded`}
                  onClick={() => handleChoiceSelect(choice.value)}
                >
                  <span className='font-semibold mr-2'>{choice.value}:</span>
                  <span>{choice.content}</span>
                </div>
              ))}
            </div>
          )}
          <div className='flex justify-end space-x-4 mt-8'>
            {!submitted ? (
              <Button
                buttonText='Submit'
                onClick={handleSubmit}
                buttonType='base'
                themeColor='green'
              />
            ) : (
              <span className='text-green-700'>
                You have submitted your answer.
              </span>
            )}
          </div>
          {reminded && (
            <div className='flex justify-end space-x-4 mt-8'>
              <span className='text-green-700'>
                Please answer the question before the submission.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
