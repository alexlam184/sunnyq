'use client';
import { MESSAGE } from '@/src/lib/enum';
import { socket } from '@/src/lib/socket/socketio.service';
import { User } from '@/src/lib/type';
import { useLobbyStore } from '@/store/LobbyStore';
import { useRoomStore } from '@/store/RoomStore';
import React, { useState } from 'react';

export default function ClientIdle() {
  const [username, setUsername] = useState<string>('');
  const [roomCode, setRoomCode] = useState<string>('');

  const { hasRoom, isFull, setLobby } = useLobbyStore();
  const { addUser } = useRoomStore();

  const handleJoinClick = () => {
    socket.emit(MESSAGE.FETCH_LOBBY, (lobby: string[]) => {
      setLobby(lobby);
      if (!hasRoom(roomCode)) {
        console.log(`Client-Page: No such room{${roomCode}}`);
        return;
      }
      if (isFull(lobby)) {
        console.log(`Client-Page: Room ${roomCode} is full`);
        return;
      }

      socket.emit(MESSAGE.FETCH_USERID, (userid: string) => {
        const user: User = {
          userid: userid,
          username: username,
        };
        socket.emit(MESSAGE.JOIN_ROOM, { roomCode: roomCode, user: user });

        //Update local state
        addUser(user);
      });
    });
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-4xl font-bold mb-8'>Join the Room</h1>
      <div className='text-2xl'>Username</div>
      <input
        type='text'
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
        className='border border-gray-400 rounded px-4 py-2 text-black'
        placeholder='Enter user name'
      />
      <div className='text-2xl'>Room Code</div>
      <input
        type='text'
        value={roomCode}
        onChange={(e) => {
          setRoomCode(e.target.value);
        }}
        className='border border-gray-400 rounded px-4 py-2 text-black'
        placeholder='Enter room code'
      />
      <button
        className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded'
        onClick={handleJoinClick}
      >
        Join
      </button>
    </div>
  );
}
