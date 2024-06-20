'use client';
import ClientIdle from '@/src/components/client/ClientIdle';
import { MESSAGE, PAGESTATE } from '@/src/lib/enum';
import { socket } from '@/src/lib/socket/socketio.service';
import { usePageStateStore } from '@/store/PageStateStroe';
import { useLobbyStore } from '@/store/LobbyStore';
import React, { useEffect, useState } from 'react';
import { useRoomStore } from '@/store/RoomStore';

const renderSwitch = (param: PAGESTATE) => {
  switch (param) {
    case PAGESTATE.front:
      return <ClientIdle />;
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

    //Room Fetching Event
    socket.on(MESSAGE.FETCH_ROOM, (requestCommand, requestItem) => {
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
  }, []);

  return (
    <div className='min-h-screen'>
      <title>Client page</title>
      {renderSwitch(pageState)}
    </div>
  );
}
