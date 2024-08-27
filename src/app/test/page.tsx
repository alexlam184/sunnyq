'use client';

import Button from '@/src/components/ui/Button';
import InputField from '@/src/components/ui/InputField';
import { MESSAGE } from '@/src/lib/enum';
import { socket } from '@/src/lib/socket/socketio.service';
import { QUESTION, Room } from '@/src/lib/type';
import { useState } from 'react';

export default function HostPage() {
  const options = ['A', 'B', 'C', 'D'];

  const [roomCode, setRoomCode] = useState<string>('');
  const [dataCount, setDataCount] = useState<number>(30);
  const [startindex, setStartIndex] = useState<number>(0);

  const dummyData_30 = (roomCode: string) => {
    for (let i = 0; i < dataCount; i++) {
      // dummy user
      const user = {
        userid: 'test' + (i + 1 + startindex),
        username: 'test' + (i + 1 + startindex),
      };
      // Join Room
      socket.emit(MESSAGE.JOIN_ROOM, { roomCode: roomCode, user: user });
      socket.emit(MESSAGE.FETCH_ROOM, roomCode, (room: Room) => {
        const questions = room.questions;
        const answers = questions.map((q, i) => {
          return q.type === QUESTION.MultipleChoice
            ? options[Math.floor(Math.random() * options.length)].toString()
            : 'test' +
                (i + 1 + startindex) +
                ' answer' +
                options[Math.floor(Math.random() * options.length)].toString();
        });
        socket.emit(MESSAGE.SUBMIT_ANSWER, {
          roomCode: roomCode,
          userid: user.userid,
          answers: answers,
        });
      });
    }
    setStartIndex(startindex + dataCount);
  };

  const [input, setInput] = useState('');

  const onChangeHandler = (e: any) => {
    setInput(e.target.value);
    socket.emit('input-change', e.target.value);
  };

  return (
    <section className='bg-slate-100'>
      <div className='mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center'>
        <div className='mx-auto max-w-xl text-center space-y-3'>
          <h1 className='text-3xl font-extrabold sm:text-5xl text-black'>
            Random data injection
          </h1>
          <div className='flex items-center justify-center'>
            <InputField
              type='text'
              title='room code'
              onChange={(e) => {
                setRoomCode(e.target.value);
              }}
              defaultValue={roomCode}
            />
          </div>
          <div className='flex items-center justify-center'>
            <InputField
              type='number'
              title='number of dummy data'
              onChange={(e) => {
                setDataCount(Number(e.target.value));
              }}
              defaultValue={dataCount}
            />
          </div>
          <div className='mt-8 flex flex-wrap justify-center gap-4'>
            <Button
              buttonText='inject'
              onClick={() => {
                dummyData_30(roomCode);
              }}
              buttonType='base'
              themeColor='red'
            />
          </div>
          <div className='mt-8 flex flex-wrap justify-center gap-4'>
            <input
              placeholder='Type something'
              value={input}
              onChange={onChangeHandler}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
