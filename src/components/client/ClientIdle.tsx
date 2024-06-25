'use client';
import { MESSAGE, PAGESTATE } from '@/src/lib/enum';
import { socket } from '@/src/lib/socket/socketio.service';
import { Room, User } from '@/src/lib/type';
import { useLobbyStore } from '@/store/LobbyStore';
import { usePageStateStore } from '@/store/PageStateStroe';
import { useRoomStore } from '@/store/RoomStore';
import React, { useState } from 'react';
import Button from '../ui/Button';
import InputField from '../ui/InputField';

export default function ClientIdle() {
  const [roomCode, setRoomCode] = useState<string>('');

  const { hasRoom, isFull, setLobby } = useLobbyStore();
  const { setRoom, username, setUsername } = useRoomStore();
  const { setPageState } = usePageStateStore();

  const handleJoinClick = () => {
    socket.emit(MESSAGE.FETCH_LOBBY, (lobby: string[]) => {
      // Fetch Lobby
      setLobby(lobby);

      // Check Room Validity
      if (!hasRoom(roomCode)) {
        console.log(`Client-Page: No such room{${roomCode}}`);
        return;
      }
      if (isFull(lobby)) {
        console.log(`Client-Page: Room ${roomCode} is full`);
        return;
      }

      // Fetch user id
      socket.emit(MESSAGE.FETCH_USERID, (userid: string) => {
        const user: User = {
          userid: userid,
          username: username,
        };

        // Join Room
        socket.emit(MESSAGE.JOIN_ROOM, { roomCode: roomCode, user: user });

        // Fetch Room
        socket.emit(MESSAGE.FETCH_ROOM, roomCode, (room: Room) => {
          setRoom(room);
          //Change Page
          setPageState(PAGESTATE.inGame);
        });
      });
    });
  };

  return (
    /*     <section className='bg-white'>
      <div className='mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center'>
        <div className='mx-auto max-w-xl text-center'>
          <h1 className='text-3xl font-extrabold sm:text-5xl text-black'>
            Welcome to SunnyQ!
          </h1>

          <p className='mt-4 sm:text-xl/relaxed text-black'>
            Teacher and Students can enjoy the fun of learning together.
          </p>
          <div className='mt-8 flex flex-wrap justify-center gap-4'>
            <Button
              buttonText='Join Room'
              onClick={() => {}}
              buttonType='base'
            />
            <Button
              buttonText='Learn More'
              onClick={() => {}}
              buttonType='border'
            />
          </div>
        </div>
      </div>
    </section> */
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
