'use client';

import Button from '@/src/components/ui/Button';
import InputField from '@/src/components/ui/InputField';
import { MESSAGE } from '@/src/lib/enum';
import { socket } from '@/src/lib/socket/socketio.service';
import { Room } from '@/src/lib/type';
import { useEffect, useState } from 'react';

export default function HostPage() {
  const [input, setInput] = useState('');

  useEffect(() => {
    console.log('socket.io is connecting...');
    socket.on('connect', () => {
      console.log(`socketio connect success with id: ${socket.id}`);
    });
  }, []);

  const onChangeHandler = (e: any) => {
    setInput(e.target.value);
    socket.emit('input-change', e.target.value);
  };

  return (
    <section className='bg-slate-100'>
      <div className='mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center'>
        <div className='mx-auto max-w-xl text-center space-y-3'>
          <h1 className='text-3xl font-extrabold sm:text-5xl text-black'>
            Socket io testing
          </h1>
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
