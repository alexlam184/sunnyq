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
import UserList from '../common/UserList';
import AnswerList from '../common/AnswerList';
import Toggle from '../ui/Toggle';

/**
 * Define the Tab options
 */
enum TABS {
  Answers = 'Answers',
  Statistics = 'Statistics',
}

export default function HostRoom() {
  const { room, resetRoom, setRoom } = useRoomStore();
  const { resetPageState } = usePageStateStore();
  const { forceUpdate } = useForceUpdate();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  /**
   * Define the tabs option
   */
  const [tab, setTab] = useState<TABS>(TABS.Answers);

  /**
   * The Component of the Info Tab
   */
  const { Canvas } = useQRCode();
  const InfoTab = useCallback(() => {
    const url =
      ((process.env.NEXT_PUBLIC_NODE_ENV !== 'production'
        ? process.env.NEXT_PUBLIC_SOCKETIO_HOSTNAME +
          ':' +
          process.env.NEXT_PUBLIC_SOCKETIO_PORT
        : process.env.NEXT_PUBLIC_SOCKETIO_HOSTNAME) as string) +
      '/client?roomcode=' +
      room.roomCode;

    console.log('platform=', process.env.NEXT_PUBLIC_NODE_ENV);
    console.log('url=', url);

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
  }, [room.host.username, room.roomCode, Canvas]);

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
    socket.emit(MESSAGE.CHANGE_ROOM_DATA, {
      roomCode: room.roomCode,
      data: {
        phase: roomPhase,
      },
    });
    forceUpdate(room.phase);
  };

  return (
    <div className='flex min-h-screen lg:h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-sky-100 text-gray-800 p-4 sm:p-6 lg:p-8 flex-col lg:flex-row'>
      <div className='w-full lg:w-72 xl:w-80 flex flex-col order-1 max-h-screen'>
        {/* Info Field */}
        {room.phase !== ROOM_PHASE.WAITING && (
          <div className='bg-white rounded-3xl shadow-lg p-6 mb-8 flex-none border border-white/70'>
            <InfoTab />
          </div>
        )}

        {/* Player List Field */}
        <UserList
          num_of_students={room.num_of_students}
          users={room.users}
          currentQuestionIndex={currentQuestionIndex}
        />
      </div>

      {/* Question Answer Field */}
      <div className='flex-grow max-w-4xl w-full bg-white/95 rounded-3xl shadow-lg p-5 sm:p-6 lg:p-8 lg:ml-6 order-1 lg:order-2 mb-6 lg:mb-0 border border-white/70 flex flex-col min-h-0'>
        <h1 className='text-3xl sm:text-4xl font-black mb-5 text-center text-rose-600'>
          Host Dashboard
        </h1>
        {room.phase !== ROOM_PHASE.WAITING ? (
          <div className='bg-rose-50/70 p-4 sm:p-6 rounded-2xl flex-1 min-h-0 border border-rose-100 w-full max-h-[70vh] lg:max-h-[72vh] flex flex-col overflow-hidden'>
            {/* Question Navigation */}
            {/* Question area */}
            <div className='flex-1 min-h-0 overflow-y-auto'>
              <div className='flex justify-center items-center mb-4'>
                <span className='text-xl font-bold'>
                  Question {currentQuestionIndex + 1} of {room.questions.length}
                </span>
              </div>

              {/* Question inside*/}
              <div>
                {/* Question and Remarks */}
                <h2 className='text-2xl font-black mb-4 text-sky-600'>
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
              </div>
            </div>
            

            {/*Pagination*/}
            <div className='pt-4 flex-none bg-rose-50/70'>
              <Pagination
                totalPages={room.questions.length}
                currentIndex={currentQuestionIndex}
                onPageChange={setCurrentQuestionIndex}
              />
            </div>
          </div>
        ) : (
          <div className=' bg-rose-50/70 rounded-2xl shadow-lg p-4 sm:p-6 mb-6 flex items-center justify-center border border-rose-100'>
            <div className='flex flex-col items-start justify-center'>
              <InfoTab />
            </div>
          </div>
        )}
        <div className='p-2 grid gap-2 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 mt-4'>
          <div className='flex items-center justify-center space-x-2'>
            <span className='text-black text-md'>Show User List</span>
            <Toggle
              activeColor='blue'
              onClick={(e) => {
                socket.emit(MESSAGE.CHANGE_ROOM_DATA, {
                  roomCode: room.roomCode,
                  data: {
                    showUserList: !room.showUserList,
                  },
                });
                setRoom({ ...room, showUserList: !room.showUserList });
              }}
              defaultChecked={room.showUserList}
            />
          </div>
          <div className='flex items-center justify-center space-x-2'>
            <span className='text-black text-md'>Show Answers</span>
            <Toggle
              activeColor='blue'
              onClick={(e) => {
                socket.emit(MESSAGE.CHANGE_ROOM_DATA, {
                  roomCode: room.roomCode,
                  data: {
                    showAnswers: !room.showAnswers,
                  },
                });
                setRoom({ ...room, showAnswers: !room.showAnswers });
              }}
              defaultChecked={room.showAnswers}
            />
          </div>
          <div className='flex items-center justify-center space-x-2'>
            <span className='text-black text-md'>Show Statistics</span>
            <Toggle
              activeColor='blue'
              onClick={(e) => {
                socket.emit(MESSAGE.CHANGE_ROOM_DATA, {
                  roomCode: room.roomCode,
                  data: {
                    showStatistics: !room.showStatistics,
                  },
                });
                setRoom({ ...room, showStatistics: !room.showStatistics });
              }}
              defaultChecked={room.showStatistics}
            />
          </div>
        </div>
        {/* Buttons */}
        <div className='flex flex-wrap justify-center gap-4 mt-6'>
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
        <div className='flex-grow max-w-lg w-full bg-white/95 rounded-3xl shadow-lg p-5 sm:p-6 lg:p-8 lg:ml-6 order-1 lg:order-2 mb-6 lg:mb-0 space-y-4 border border-white/70'>
          <Tabs
            options={[
              { value: TABS.Answers, label: TABS.Answers },
              { value: TABS.Statistics, label: TABS.Statistics },
            ]}
            onChange={(option: TabOption) => {
              setTab(option.value);
            }}
            disabledValues={
              room.questions[currentQuestionIndex].type === QUESTION.OpenEnd
                ? [TABS.Statistics]
                : undefined
            }
            themeColor='blue'
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
