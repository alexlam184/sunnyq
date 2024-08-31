'use client';

import HostIdle from '@src/components/host/HostIdle';
import React, { useEffect } from 'react';
import HostCreateRoom from '@/src/components/host/HostCreateRoom';
import { PAGESTATE, MESSAGE } from '@/src/lib/enum';
import HostRoom from '@/src/components/host/HostRoom';
import { usePageStateStore } from '@/store/PageStateStroe';
import { socket } from '@/src/lib/socket/socketio.service';
import { useLobbyStore } from '@/store/LobbyStore';
import { useRoomStore } from '@/store/RoomStore';
import Modal from '@/src/components/common/Modal';
import { useGeneralStateStore } from '@/store/GeneralStateStore';

const renderSwitch = (param: PAGESTATE) => {
  switch (param) {
    case PAGESTATE.front:
      return <HostIdle />;
    case PAGESTATE.createRoom:
      return <HostCreateRoom />;
    case PAGESTATE.inGame:
      return <HostRoom />;
    default:
      return <HostIdle />;
  }
};

export default function HostPage() {
  const { pageState } = usePageStateStore();
  const { resetLobby } = useLobbyStore();
  const { addUser, setRoom } = useRoomStore();
  const {
    general_modalIsOpenedState,
    setGeneral_ModalIsOpenedState,
    general_modalContentState,
    setGeneral_ModalContentState,
  } = useGeneralStateStore();

  useEffect(() => {
    resetLobby();

    //Subscribe Room Fetching Event
    socket.on(MESSAGE.FETCH_REQUEST, (requestCommand, requestItem) => {
      switch (requestCommand) {
        case 'add-user':
          addUser(requestItem);
          break;
        case 'fetch-room':
          setRoom(requestItem);
          break;
        default:
          console.log(
            `Invalid room fetching with item:${requestCommand} ${requestItem}`
          );
          setGeneral_ModalContentState(
            'Invalid room',
            `Invalid room fetching with item:${requestCommand} ${requestItem}`
          );
          setGeneral_ModalIsOpenedState(true);
      }
    });

    //Unsubscribe Room Fetching Event
    return () => {
      socket.off(MESSAGE.FETCH_REQUEST);
    };
  }, [
    addUser,
    resetLobby,
    setRoom,
    setGeneral_ModalContentState,
    setGeneral_ModalIsOpenedState,
  ]);

  return (
    <div className='min-h-screen'>
      <title>Host page</title>
      {renderSwitch(pageState)}
      <Modal
        isOpened={general_modalIsOpenedState}
        setIsOpen={setGeneral_ModalIsOpenedState}
        contentState={general_modalContentState}
      />
    </div>
  );
}
