import React, { useEffect, useState } from 'react';
import Button from '../ui/Button';
import { useHostStore } from '@/store/zustand/HostStore';
import { useSocketStore } from '@/store/zustand/SocketStore';
import { socket } from '@/src/lib/socket/socket';

export default function HostCreateRoom() {
  const { resetGame } = useHostStore();
  const { username, player, addPlayer, setPlayer, allPlayers, setAllPlayers } =
    useSocketStore();

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [transport, setTransport] = useState('N/A');

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on('upgrade', (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport('N/A');
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    socket.on('receive-message', (data) => {
      console.log('> receive message', data);
      addPlayer(data);
    });

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  const handleCreateGame = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log('emitted');
    socket.emit('send-message', player);
    setPlayer('');
  };

  return (
    <div className='flex flex-col justify-center'>
      <span>Create Room</span>
      <form className='flex flex-col' onSubmit={handleCreateGame}>
        <input
          type='text'
          className='text-black'
          name='player'
          placeholder='enter your player'
          value={player}
          onChange={(e) => setPlayer(e.target.value)}
          autoComplete={'off'}
        ></input>

        <Button name={'Create'} type={'submit'}></Button>
        <Button name={'Back'} onclick={resetGame} />
        <Button
          name={'Get Player'}
          onclick={() => {
            console.log('get player');
            socket.on('receive-message', (data) => {
              console.log('Add data:', data);
              addPlayer(data);
            });
          }}
        />
      </form>
      <div>
        <p>Status: {isConnected ? 'connected' : 'disconnected'}</p>
        <p>Transport: {transport}</p>
      </div>
      <div>
        {allPlayers.map((username, index) => (
          <div key={index}>{username}</div>
        ))}
      </div>
    </div>
  );
}
