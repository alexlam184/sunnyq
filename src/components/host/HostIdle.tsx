import { PAGESTATE } from '@/src/lib/enum';
import { usePageStateStore } from '@/store/PageStateStroe';
import React from 'react';
import Button from '../ui/Button';

export default function HostIdle() {
  const { setPageState } = usePageStateStore();
  const handleCreateRoom = () => {
    setPageState(PAGESTATE.createRoom);
  };

  return (
    <section className='bg-slate-100'>
      <div className='min-h-screen px-4 py-64 lg:py-32 lg:flex lg:h-screen items-center justify-center'>
        <div className='mx-auto max-w-xl text-center'>
          <h1 className='text-3xl font-extrabold sm:text-5xl text-black'>
            Welcome to SunnyQ!
          </h1>

          <p className='mt-4 sm:text-xl/relaxed text-black'>
            Teacher and Students can enjoy the fun of learning together.
          </p>

          <div className='mt-8 flex flex-wrap justify-center gap-4'>
            <Button
              buttonText='Create Room'
              onClick={handleCreateRoom}
              buttonType='base'
              themeColor='blue'
            />
            <Button
              buttonText='Learn More'
              onClick={() => {}}
              buttonType='border'
              themeColor='blue'
            />
          </div>
        </div>
      </div>
    </section>
  );
}
