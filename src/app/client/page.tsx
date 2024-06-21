'use client';
import ClientIdle from '@/src/components/client/ClientIdle';
import { MESSAGE, PAGESTATE } from '@/src/lib/enum';
import { socket } from '@/src/lib/socket/socketio.service';
import { usePageStateStore } from '@/store/PageStateStroe';
import { useLobbyStore } from '@/store/LobbyStore';
import React, { useEffect, useState } from 'react';
import { useRoomStore } from '@/store/RoomStore';
import ClientRoom from '@/src/components/client/ClientRoom';

const renderSwitch = (param: PAGESTATE) => {
  switch (param) {
    case PAGESTATE.front:
      return <ClientIdle />;
    case PAGESTATE.inGame:
      return <ClientRoom />;
    default:
      return <ClientIdle />;
  }
};

export default function ClientPage() {
  const { pageState } = usePageStateStore();
  const { resetLobby } = useLobbyStore();
  const { addUser } = useRoomStore();

  useEffect(() => {
    resetLobby();

    //Subscribe Room Fetching Event
    socket.on(MESSAGE.FETCH_REQUEST, (requestCommand, requestItem) => {
      switch (requestCommand) {
        case 'add-user':
          addUser(requestItem);
          break;
        default:
          console.log(
            `Invalid room fetching with item:${requestCommand} ${requestItem}`
          );
      }
    });

    //Unsubscribe Room Fetching Event
    return () => {
      socket.off(MESSAGE.FETCH_REQUEST);
    };
  }, []);

  return (
    <div className='min-h-screen'>
      <title>Client page</title>
      {renderSwitch(pageState)}
    </div>
  );
}
