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
    <section className='relative overflow-hidden bg-gradient-to-br from-yellow-100 via-pink-100 to-sky-100'>
      <div className='pointer-events-none absolute -top-16 -left-12 h-56 w-56 rounded-full bg-yellow-300/40 blur-3xl' />
      <div className='pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-sky-300/40 blur-3xl' />
      <div className='min-h-screen px-4 py-32 lg:py-32 lg:flex lg:h-screen items-center justify-center'>
        <div className='mx-auto max-w-xl text-center rounded-3xl border border-white/60 bg-white/90 p-8 shadow-xl backdrop-blur'>
          <h1 className='text-3xl font-black sm:text-5xl text-slate-900'>
            Welcome to SunnyQ! 🎈
          </h1>

          <p className='mt-4 sm:text-xl/relaxed text-slate-700'>
            Teachers and students can play, learn, and laugh together.
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
