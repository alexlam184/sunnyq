import { PAGESTATE } from '@/src/lib/enum';
import { usePageStateStore } from '@/store/PageStateStroe';
import React from 'react';

export default function HostIdle() {
  const { setPageState: setGame } = usePageStateStore();
  const handleCreateRoom = () => {
    setGame(PAGESTATE.createRoom);
  };
  const handleExit = () => {};

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-4xl font-bold mb-8'>Welcome to SunnyQ!</h1>
      <div className='space-x-4'>
        <button
          className='bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded'
          onClick={handleCreateRoom}
        >
          Create Room
        </button>
        <button
          className='bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded'
          onClick={handleExit}
        >
          Exit
        </button>
      </div>
    </div>
  );
}
