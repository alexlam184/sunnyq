import React from 'react';
import Button from '@/src/components/ui/Button';
import { useHostStore } from '@/store/zustand/HostStore';
export default function HostIdle() {
  const { game, setGame } = useHostStore();
  const handleNewRoom = () => {
    console.log('creating new room');
    setGame('create');
  };

  const handleJoinRoom = () => {
    console.log('Joining room');
    alert('Join room');
  };

  return (
    <div className='flex justify-center items-center flex-col'>
      <span>Sunny Quiz Online</span>
      <div className='flex flex-col '>
        <Button name={'New Room'} onclick={handleNewRoom} />
        <Button name={'Join Room'} onclick={handleJoinRoom} />
      </div>
    </div>
  );
}
