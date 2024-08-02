'use client';
import ClientIdle from '@/src/components/client/ClientIdle';
import { MESSAGE, PAGESTATE } from '@/src/lib/enum';
import { socket } from '@/src/lib/socket/socketio.service';
import { usePageStateStore } from '@/store/PageStateStroe';
import { useLobbyStore } from '@/store/LobbyStore';
import React, { useEffect } from 'react';
import { useRoomStore } from '@/store/RoomStore';
import ClientRoom from '@/src/components/client/ClientRoom';
import Modal from '@/src/components/common/Modal';
import { useGeneralStateStore } from '@/store/GeneralStateStore';

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
  const { pageState, resetPageState } = usePageStateStore();
  const { resetLobby } = useLobbyStore();
  const { addUser, setRoom, resetRoom } = useRoomStore();
  const {
    general_modalIsOpenedState,
    setGeneral_ModalIsOpenedState,
    general_modalContentState,
    setGeneral_ModalContentState,
  } = useGeneralStateStore();

  useEffect(() => {
    if (!socket.connected) {
      setGeneral_ModalContentState(
        'No socket.io connection',
        `Something went wrong. Please check socket.io`
      );
      setGeneral_ModalIsOpenedState(true);
    }
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
        case 'leave-room':
          resetRoom();
          resetPageState();
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
  }, [addUser, resetLobby, resetPageState, resetRoom, setRoom]);

  return (
    <div className='min-h-screen'>
      <title>Client page</title>
      {renderSwitch(pageState)}
      <Modal
        isOpened={general_modalIsOpenedState}
        setIsOpen={setGeneral_ModalIsOpenedState}
        contentState={general_modalContentState}
      />
    </div>
  );
}
