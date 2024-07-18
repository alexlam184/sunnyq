'use client';
import { choice, CHOICE, QUESTION } from '@/src/lib/type';
import { useRoomStore } from '@/store/RoomStore';
import { useState } from 'react';
import Button from '../ui/Button';
import { socket } from '@/src/lib/socket/socketio.service';
import { MESSAGE } from '@/src/lib/enum';
import TextAreaField from '../ui/TextAreaField';
import { ROOM_PHASE } from '@/src/lib/room-phase';

export default function ClientRoom() {
  const { username, userid, room } = useRoomStore();
  const [answer, setAnswer] = useState<string | null>(
    room.question.type === QUESTION.MultipleChoice ? null : ''
  );
  const [submitted, setSubmitted] = useState<boolean>(
    room.phase === ROOM_PHASE.PAUSE
  );
  const [reminded, setReminded] = useState<boolean>(false);

  const handleChoiceSelect = (choice: CHOICE) => {
    if (submitted) return;
    setAnswer(choice);
  };

  const handleSubmit = () => {
    if (submitted) return;

    if (answer == null) {
      setReminded(true);
      return;
    }

    socket.emit(MESSAGE.SUBMIT_ANSWER, {
      roomCode: room.roomCode,
      userid: userid,
      answer: answer,
    });
    setSubmitted(true);
    setReminded(false);
  };

  return (
    <div className='flex min-h-screen bg-gradient-to-b from-green-100 to-green-200 text-gray-800 p-8 flex-col md:flex-row'>
      <div className='w-full md:w-80 flex flex-col order-1'>
        {/* Info Field */}
        <div className='bg-white rounded-lg shadow-lg p-6 mb-8 flex-none'>
          <h2 className='text-2xl font-bold mb-4 text-black'>
            Username:{' '}
            <span className='font-semibold text-black'>{username}</span>
          </h2>
          <h2 className='text-2xl font-bold mb-4 text-black'>
            Teacher:{' '}
            <span className='font-semibold text-black'>
              {room.host.username}
            </span>
          </h2>
          <h2 className='text-2xl font-bold mb-4 text-black'>
            Room Code:{' '}
            <span className='font-semibold text-black'>{room.roomCode}</span>
          </h2>
        </div>
      </div>

      {/* Question Answer Field */}
      <div className='flex-grow max-w-3xl bg-white rounded-lg shadow-lg p-8 md:ml-8 order-1 md:order-2 mb-8 md:mb-0'>
        <h1 className='text-4xl font-bold mb-6 text-center text-green-600'>
          Client Dashboard
        </h1>

        <div className='bg-gray-100 p-6 rounded-lg flex-grow'>
          {/* Question and Remarks */}
          <h2 className='text-2xl font-bold mb-4 text-green-600'>Question</h2>
          <p className='text-xl mb-2'>{room.question.question}</p>
          <p className='text-sm text-gray-500 mb-4'>{room.question.remark}</p>

          {/* Answer Field */}
          {room.question.type === QUESTION.MultipleChoice ? (
            <div className='space-y-4'>
              {room.question.choices?.map((choice: choice) => (
                <div
                  key={choice.value}
                  className={`flex items-center text-lg cursor-pointer ${
                    room.phase !== ROOM_PHASE.PAUSE
                      ? choice.value === answer
                        ? 'bg-green-200'
                        : 'bg-white'
                      : choice.value === room.question.answer
                        ? 'bg-green-200'
                        : choice.value === answer
                          ? 'bg-red-200'
                          : 'bg-white'
                  } p-2 rounded`}
                  onClick={() => handleChoiceSelect(choice.value)}
                >
                  <span className='font-semibold mr-2'>{choice.value}:</span>
                  <span>{choice.content}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className='space-y-4'>
              <TextAreaField
                title='Answer'
                rows={5}
                onChange={(e) => {
                  setAnswer(e.target.value);
                }}
                defaultValue={answer || ''}
                disabled={submitted}
              />
            </div>
          )}

          {/* Submit button */}
          <div className='flex justify-end space-x-4 mt-8'>
            {!submitted ? (
              <Button
                buttonText='Submit'
                onClick={handleSubmit}
                buttonType='base'
                themeColor='green'
              />
            ) : (
              room.phase !== ROOM_PHASE.PAUSE && (
                <span className='text-green-700'>
                  You have submitted your answer.
                </span>
              )
            )}
          </div>

          {/*Display a reminder to answer multiple-choice question before submission when reminded is true*/}
          {room.question.type === QUESTION.MultipleChoice && reminded && (
            <div className='flex justify-end space-x-4 mt-8'>
              <span className='text-green-700'>
                Please answer the question before the submission.
              </span>
            </div>
          )}

          {/*Display the answer after the room is paused*/}
          {room.phase === ROOM_PHASE.PAUSE &&
            (room.question.type === QUESTION.OpenEnd ? (
              <div className='flex justify-end space-x-4 mt-8'>
                <span className='text-green-700'>Times up!</span>
              </div>
            ) : (
              <div className='flex justify-end space-x-4 mt-8'>
                <span className='text-green-700'>
                  Correct Answer: {room.question.answer}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
