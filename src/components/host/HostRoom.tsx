import { QUESTION } from '@/src/lib/type';
import { useRoomStore } from '@/store/RoomStore';
import Button from '../ui/Button';
import { useCallback, useMemo, useState } from 'react';
import Tabs from '../ui/Tabs';
import { TabOption } from '../ui/Tabs';
import Statistics from '../common/Statistics';
import { socket } from '@/src/lib/socket/socketio.service';
import { MESSAGE } from '@/src/lib/enum';
import { usePageStateStore } from '@/store/PageStateStroe';
import { ROOM_PHASE } from '@/src/lib/room-phase';
import { useForceUpdate } from '@/src/hook/useForceUpdate';
import { useQRCode } from 'next-qrcode';
import Pagination from '../ui/Pagination';

/**
 * Define the Tab options
 */
enum TABS {
  Answers = 'Answers',
  Statistics = 'Statistics',
}

export default function HostRoom() {
  const { room, resetRoom } = useRoomStore();
  const { resetPageState } = usePageStateStore();
  const { forceUpdate } = useForceUpdate();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  /**
   * Define the tabs option
   */
  const [tab, setTab] = useState<TABS>(TABS.Answers);
  const options: TabOption[] = useMemo(() => {
    return [
      { value: TABS.Answers, label: TABS.Answers },
      { value: TABS.Statistics, label: TABS.Statistics },
    ];
  }, []);

  /**
   * The Component of the Info Tab
   */
  const InfoTab = useCallback(() => {
    return (
      <>
        <h2 className='text-2xl font-bold mb-4 text-black'>
          Teacher:{' '}
          <span className='font-semibold text-black'>{room.host.username}</span>
        </h2>
        <p className='text-xl mb-2'>
          Code:{' '}
          <span className='font-extrabold text-blue-700 text-3xl'>
            {room.roomCode}
          </span>
        </p>
        <div className='flex justify-center lg:justify-start'>
          <Canvas
            text={url}
            options={{
              errorCorrectionLevel: 'M',
              margin: 3,
              scale: 4,
              width: 200,
            }}
          />
        </div>
      </>
    );
  }, [room.host.username, room.roomCode]);

  /**
   * The Component of the Player List Tab
   */
  const PlayerList = useCallback(() => {
    return (
      <div className='scroll-container overflow-y-auto'>
        {room.num_of_students > 0 ? (
          <ul className='space-y-2 mt-4'>
            {room.users.map((user, index) => (
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
                      ? `bg-blue-400 border border-blue-600 rounded-full w-5 h-5`
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
    );
  }, [room.users, room.num_of_students, currentQuestionIndex]);

  /**
   * The Component of the Answer List Tab
   */
  const AnswerList = useCallback(() => {
    const answeredUsers = room.users.filter(
      (user) => user.answers && user.answers[currentQuestionIndex] != null
    );
    const getColorClass = (answer?: any) => {
      const currentQuestion = room.questions[currentQuestionIndex];
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
  }, [room.users, room.questions, currentQuestionIndex]);

  /**
   * Handle delete room event
   */
  const handleDeleteRoom = () => {
    socket.emit(MESSAGE.DELETE_ROOM, { roomCode: room.roomCode });
    resetRoom();
    resetPageState();
  };

  /**
   * Handle stage room event
   */
  const handleRoomPhase = (roomPhase: ROOM_PHASE) => {
    room.phase = roomPhase;
    socket.emit(MESSAGE.CHANGE_ROOM_PHASE, {
      roomCode: room.roomCode,
      roomPhase,
    });
    forceUpdate(room.phase);
  };

  /**
   * Handle QR Code Generation
   */
  const { Canvas } = useQRCode();
  const url =
    process.env.NEXT_PUBLIC_SOCKETIO_HOSTNAME +
    ':' +
    process.env.NEXT_PUBLIC_SOCKETIO_PORT +
    '/client?roomcode=' +
    room.roomCode;

  return (
    <div className='flex md:h-screen bg-gradient-to-b from-blue-100 to-blue-200 text-gray-800 p-8 flex-col md:flex-row'>
      <div className='w-full md:w-80 flex flex-col order-1 max-h-screen'>
        {/* Info Field */}
        {room.phase !== ROOM_PHASE.WAITING && (
          <div className='bg-white rounded-lg shadow-lg p-6 mb-8 flex-none'>
            <InfoTab />
          </div>
        )}

        {/* Player List Field */}
        <div className='bg-white rounded-lg shadow-lg p-6 flex-grow mb-8 lg:mb-0 overflow-hidden flex flex-col'>
          <div className='w-full flex justify-between items-center mb-4'>
            <h2 className='text-2xl font-bold text-blue-600'>Joined Players</h2>
            <span className='font-bold text-2xl px-2 bg-blue-100 text-blue-700 rounded-lg'>
              {
                room.users.filter(
                  (user) => user.answers && user.answers[currentQuestionIndex]
                ).length
              }
              /{room.num_of_students}
            </span>
          </div>
          <div className='overflow-y-auto flex-grow border-t border-gray-200'>
            <PlayerList />
          </div>
        </div>
      </div>

      {/* Question Answer Field */}
      <div className='flex-grow max-w-3xl bg-white rounded-lg shadow-lg p-8 md:ml-8 order-1 md:order-2 mb-8 md:mb-0'>
        <h1 className='text-4xl font-bold mb-6 text-center text-blue-600'>
          Host Dashboard
        </h1>
        {room.phase !== ROOM_PHASE.WAITING ? (
          <div className='bg-gray-100 p-6 rounded-lg flex-grow'>
            {/* Question Navigation */}
            <div className='flex justify-center items-center mb-4'>
              <span className='text-xl font-bold'>
                Question {currentQuestionIndex + 1} of {room.questions.length}
              </span>
            </div>

            {/* Question and Remarks */}
            <h2 className='text-2xl font-bold mb-4 text-blue-600'>
              Question {currentQuestionIndex + 1}
            </h2>
            <p className='text-xl mb-2'>
              {room.questions[currentQuestionIndex].question}
            </p>
            <p className='text-sm text-gray-500 mb-4'>
              {room.questions[currentQuestionIndex].remark}
            </p>

            {/* Answer Field */}
            {room.questions[currentQuestionIndex].type ===
              QUESTION.MultipleChoice && (
              <div className='space-y-4'>
                {room.questions[currentQuestionIndex].choices?.map(
                  (choice, index) => (
                    <div key={index} className='flex items-center text-lg'>
                      <span className='font-semibold mr-2'>
                        {choice.value}:
                      </span>
                      <span>{choice.content}</span>
                    </div>
                  )
                )}
              </div>
            )}

            {/*Pagination*/}
            <div className='pt-4'>
              <Pagination
                totalPages={room.questions.length}
                currentIndex={currentQuestionIndex}
                onPageChange={setCurrentQuestionIndex}
              />
            </div>
          </div>
        ) : (
          <div className=' bg-gray-100 rounded-lg shadow-lg p-6 mb-8 flex items-center justify-center'>
            <div className='flex flex-col items-start justify-center'>
              <InfoTab />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className='flex justify-center space-x-4 mt-8'>
          {room.phase === ROOM_PHASE.WAITING ? (
            <Button
              buttonText='Start Game'
              onClick={() => {
                handleRoomPhase(ROOM_PHASE.RUNNING);
              }}
              buttonType='base'
              themeColor='blue'
            />
          ) : (
            <Button
              buttonText='Pause Game'
              onClick={() => {
                handleRoomPhase(ROOM_PHASE.PAUSE);
              }}
              disabled={room.phase === ROOM_PHASE.PAUSE}
              buttonType='base'
              themeColor='blue'
            />
          )}

          <Button
            buttonText='Delete Game'
            onClick={() => {
              handleDeleteRoom();
            }}
            buttonType='border'
            themeColor='blue'
          />
        </div>
      </div>

      {/* Tabs Field */}
      {room.phase !== ROOM_PHASE.WAITING && (
        <div className='flex-grow max-w-lg bg-white rounded-lg shadow-lg p-8 md:ml-8 order-1 md:order-2 mb-8 md:mb-0 space-y-4'>
          <Tabs
            options={options}
            onChange={(option: TabOption) => {
              setTab(option.value);
            }}
            defaultValue={tab}
            disabledValues={
              room.questions[currentQuestionIndex].type === QUESTION.OpenEnd
                ? [TABS.Statistics]
                : undefined
            }
          />
          {tab === TABS.Answers ? (
            <AnswerList />
          ) : (
            <Statistics
              num_of_answered={room.num_of_answered}
              question={room.questions[currentQuestionIndex]}
              users={room.users}
              currentQuestionIndex={currentQuestionIndex}
            />
          )}
        </div>
      )}
    </div>
  );
}
