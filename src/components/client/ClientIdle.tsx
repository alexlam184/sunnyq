'use client';
import { MESSAGE, PAGESTATE } from '@/src/lib/enum';
import { socket } from '@/src/lib/socket/socketio.service';
import { Room, User } from '@/src/lib/type';
import { useLobbyStore } from '@/store/LobbyStore';
import { usePageStateStore } from '@/store/PageStateStroe';
import { useRoomStore } from '@/store/RoomStore';
import React, { useEffect, useState } from 'react';
import Button from '../ui/Button';
import InputField from '../ui/InputField';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ClientIdle() {
  const [roomCode, setRoomCode] = useState<string>('');

  const { hasRoom, isFull, setLobby } = useLobbyStore();
  const { setRoom, username, setUsername, setUserID } = useRoomStore();
  const { setPageState } = usePageStateStore();

  const router = useRouter();
  const searchParams = useSearchParams();
  const roomCodeParam = searchParams.get('roomcode');
  useEffect(() => {
    if (!roomCodeParam) return;
    socket.emit(MESSAGE.FETCH_LOBBY, (lobby: string[]) => {
      // Fetch Lobby
      setLobby(lobby);
      if (!hasRoom(roomCodeParam || '')) {
        router.push('/client');
      } else {
        setRoomCode(roomCodeParam);
      }
    });
  }, [roomCodeParam, hasRoom, router, setLobby]);

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
        setUserID(userid);

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
    <section className='bg-slate-100'>
      <div className='min-h-screen px-4 py-64 lg:py-32 lg:flex lg:h-screen items-center justify-center'>
        <div className='mx-auto max-w-xl text-center space-y-3'>
          <h1 className='text-3xl font-extrabold sm:text-5xl text-black'>
            Welcome to SunnyQ!
          </h1>
          <p className='mt-4 sm:text-xl/relaxed text-black'>
            Teacher and Students can enjoy the fun of learning together.
          </p>
          <div className='flex items-center justify-center'>
            <InputField
              type='text'
              title='username'
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>
          <div className='flex items-center justify-center'>
            <InputField
              type='text'
              title='room code'
              onChange={(e) => {
                setRoomCode(e.target.value);
              }}
              defaultValue={roomCodeParam || ''}
            />
          </div>
          <div className='mt-8 flex flex-wrap justify-center gap-4'>
            <Button
              buttonText='Join Room'
              onClick={() => {
                handleJoinClick();
              }}
              buttonType='base'
              themeColor='green'
            />
            <Button
              buttonText='Learn More'
              onClick={() => {}}
              buttonType='border'
              themeColor='green'
            />
          </div>
        </div>
      </div>
    </section>
  );
}
