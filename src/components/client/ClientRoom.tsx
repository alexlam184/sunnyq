'use client';
import { choice, CHOICE, QUESTION } from '@/src/lib/type';
import { useRoomStore } from '@/store/RoomStore';
import { useEffect, useMemo, useState } from 'react';
import Button from '../ui/Button';
import { socket } from '@/src/lib/socket/socketio.service';
import { MESSAGE } from '@/src/lib/enum';
import TextAreaField from '../ui/TextAreaField';
import { ROOM_PHASE } from '@/src/lib/room-phase';
import { useRouter } from 'next/navigation';
import Pagination from '../ui/Pagination';
import { FieldValues, useFieldArray, useForm } from 'react-hook-form';
import UserList from '../common/UserList';
import Tabs, { TabOption } from '../ui/Tabs';
import AnswerList from '../common/AnswerList';
import Statistics from '../common/Statistics';

enum TABS {
  Answers = 'Answers',
  Statistics = 'Statistics',
}

export default function ClientRoom() {
  /**
   * Handle Use States
   */
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { username, userid, room } = useRoomStore();
  const [submitted, setSubmitted] = useState<boolean>(
    room.phase === ROOM_PHASE.PAUSE
  );
  const [reminded, setReminded] = useState<boolean>(false);

  const [tab, setTab] = useState<TABS | undefined>(undefined);
  const tabOptions: TabOption[] = useMemo(
    () => [
      ...(room.showAnswers
        ? [{ value: TABS.Answers, label: TABS.Answers }]
        : []),
      ...(room.showStatistics
        ? [{ value: TABS.Statistics, label: TABS.Statistics }]
        : []),
    ],
    [room.showAnswers, room.showStatistics]
  );
  useEffect(() => {
    // Find the next available option that exist
    setTab(tabOptions && tabOptions[0] ? tabOptions[0].value : undefined);
  }, [tabOptions]);

  /**
   * Handle Form
   */
  const { register, control, handleSubmit, reset, formState, watch, setValue } =
    useForm<FieldValues>({
      defaultValues: {
        answers: [] as string[],
      },
    });
  const { append } = useFieldArray({
    name: 'answers',
    control,
  });
  // Array Initialization
  useEffect(() => {
    for (let i = 0; i < room.questions.length; i++) {
      append('');
    }
  }, [append, room.questions.length]);
  const onSubmit = () => {};
  const answers = watch('answers');

  /**
   * Handle Room Event
   */
  const handleWholeSubmit = () => {
    if (submitted) return;

    // TODO: Check whether the answers are filled

    socket.emit(MESSAGE.SUBMIT_ANSWER, {
      roomCode: room.roomCode,
      userid: userid,
      answers: answers as string[],
    });
    // Update room
    setSubmitted(true);
    setReminded(false);
  };

  /**
   * Handle Router
   */
  const router = useRouter();
  useEffect(() => {
    router.push('/client?roomcode=' + room.roomCode);
  }, [room.roomCode, router]);

  return (
    <div className='flex min-h-screen lg:h-screen bg-gradient-to-b from-green-100 to-green-200 text-gray-800 p-8 flex-col md:flex-row'>
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
        {/* Player List Field */}
        {room.showUserList && (
          <UserList
            num_of_students={room.num_of_students}
            users={room.users}
            currentQuestionIndex={currentQuestionIndex}
            themeColor='green'
          />
        )}
      </div>

      {/* Question Answer Field */}
      <div className='flex-grow max-w-3xl bg-white rounded-lg shadow-lg p-8 md:ml-8 order-1 md:order-2 mb-8 md:mb-0'>
        <h1 className='text-4xl font-bold mb-6 text-center text-green-600'>
          Client Dashboard
        </h1>

        <div className='bg-gray-100 p-6 rounded-lg flex-grow'>
          {room.phase !== ROOM_PHASE.WAITING ? (
            <>
              {/* Question Navigation */}
              <div className='flex justify-center items-center mb-4'>
                <span className='text-xl font-bold'>
                  Question {currentQuestionIndex + 1} of {room.questions.length}
                </span>
              </div>

              {/* Question and Remarks */}
              <h2 className='text-2xl font-bold mb-4 text-green-600'>
                Question {currentQuestionIndex + 1}
              </h2>
              <p className='text-xl mb-2'>
                {room.questions[currentQuestionIndex].question}
              </p>
              <p className='text-sm text-gray-500 mb-4'>
                {room.questions[currentQuestionIndex].remark}
              </p>

              <form onSubmit={handleSubmit(onSubmit)}>
                {room.questions[currentQuestionIndex].type ===
                QUESTION.MultipleChoice ? (
                  <div className='space-y-4'>
                    {room.questions[currentQuestionIndex].choices?.map(
                      (choice: choice) => (
                        <button
                          name={`answers.${currentQuestionIndex}`}
                          key={choice.value}
                          className={`w-full flex items-center text-lg ${room.phase !== ROOM_PHASE.PAUSE ? 'cursor-pointer' : null} ${
                            room.phase !== ROOM_PHASE.PAUSE
                              ? choice.value === answers[currentQuestionIndex]
                                ? 'bg-green-200'
                                : 'bg-white'
                              : choice.value ===
                                  room.questions[currentQuestionIndex].answer
                                ? 'bg-green-200'
                                : choice.value ===
                                      answers[currentQuestionIndex] && submitted
                                  ? 'bg-red-200'
                                  : 'bg-white'
                          } p-2 rounded`}
                          onClick={(e) => {
                            e.preventDefault();
                            register(`answers.${currentQuestionIndex}`);
                            setValue(
                              `answers.${currentQuestionIndex}`,
                              choice.value
                            );
                          }}
                          disabled={
                            submitted || room.phase === ROOM_PHASE.PAUSE
                          }
                        >
                          <span className='font-semibold mr-2'>
                            {choice.value}:
                          </span>
                          <span>{choice.content}</span>
                        </button>
                      )
                    )}
                  </div>
                ) : (
                  <div key={currentQuestionIndex} className='space-y-4'>
                    <TextAreaField
                      name={`answers.${currentQuestionIndex}`}
                      register={register}
                      registerName={`answers.${currentQuestionIndex}`}
                      title='Answer'
                      rows={5}
                      disabled={submitted || room.phase === ROOM_PHASE.PAUSE}
                      onBlur={(e) =>
                        setValue(
                          `answers.${currentQuestionIndex}`,
                          e.target.value
                        )
                      }
                    />
                  </div>
                )}
                {/*Pagination*/}
                <div className='pt-4'>
                  <Pagination
                    type='submit'
                    totalPages={room.questions.length}
                    currentIndex={currentQuestionIndex}
                    onPageChange={setCurrentQuestionIndex}
                    themeColor='green'
                  />
                </div>
              </form>
            </>
          ) : (
            <div className='text-black text-center font-bold text-3xl'>
              Please wait the host to start the game.
            </div>
          )}
        </div>

        {/* Submit button */}
        {room.phase != ROOM_PHASE.WAITING &&
          room.phase !== ROOM_PHASE.PAUSE && (
            <div className='flex justify-end space-x-4 mt-8'>
              {!submitted ? (
                <Button
                  buttonText='Submit'
                  onClick={handleWholeSubmit}
                  buttonType='base'
                  themeColor='green'
                />
              ) : (
                <span className='text-green-700'>
                  You have submitted your answer.
                </span>
              )}
            </div>
          )}
        {/*Display a reminder to answer multiple-choice question before submission when reminded is true*/}
        {room.phase !== ROOM_PHASE.PAUSE &&
          room.questions[currentQuestionIndex].type ===
            QUESTION.MultipleChoice &&
          reminded && (
            <div className='flex justify-end space-x-4 mt-8'>
              <span className='text-green-700'>
                Please answer the question before the submission.
              </span>
            </div>
          )}

        {/*Display the answer after the room is paused*/}
        {room.phase === ROOM_PHASE.PAUSE &&
          (room.questions[currentQuestionIndex].type === QUESTION.OpenEnd ? (
            <div className='flex justify-end space-x-4 mt-8'>
              <span className='text-green-700'>Times up!</span>
            </div>
          ) : (
            <div className='flex justify-end space-x-4 mt-8'>
              <span className='text-green-700'>
                Correct Answer: {room.questions[currentQuestionIndex].answer}
              </span>
            </div>
          ))}
      </div>
      {/* Tabs Field */}
      {tab && tabOptions.length > 0 && room.phase !== ROOM_PHASE.WAITING && (
        <div className='flex-grow max-w-lg bg-white rounded-lg shadow-lg p-8 md:ml-8 order-1 md:order-2 mb-8 md:mb-0 space-y-4'>
          <Tabs
            options={tabOptions}
            onChange={(option: TabOption) => {
              setTab(option.value);
            }}
            disabledValues={
              room.questions[currentQuestionIndex].type === QUESTION.OpenEnd
                ? [TABS.Statistics]
                : undefined
            }
            themeColor='green'
            defaultValue={tab}
          />
          {tab === TABS.Answers ? (
            <AnswerList
              users={room.users}
              questions={room.questions}
              currentQuestionIndex={currentQuestionIndex}
            />
          ) : tab === TABS.Statistics ? (
            <Statistics
              num_of_answered={room.num_of_answered}
              question={room.questions[currentQuestionIndex]}
              users={room.users}
              currentQuestionIndex={currentQuestionIndex}
            />
          ) : null}
        </div>
      )}
    </div>
  );
}
