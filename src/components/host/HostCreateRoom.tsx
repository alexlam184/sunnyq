import { socket } from '@/src/lib/socket/socketio.service';
import Button from '../ui/Button';
import { usePageStateStore } from '@/store/PageStateStroe';
import { PAGESTATE, MESSAGE } from '@/src/lib/enum';
import { useRoomStore } from '@/store/RoomStore';
import { useLobbyStore } from '@/store/LobbyStore';
import { useState } from 'react';

const HostCreateRoom = () => {
  // use Zustand Stores
  const { setPageState } = usePageStateStore();
  const { setRoom } = useRoomStore();
  const { createRoom, addRoomCode, setLobby } = useLobbyStore();

  const [username, setUsername] = useState('');

  /**
   * Handles the creation of a new room.
   *
   * Emits a `FETCH_LOBBY` event to retrieve the lobby information.
   * Creates a new room using the retrieved lobby information.
   * Registers the host's user ID and username in the created room.
   * Updates the local state with the newly created room and lobby.
   *
   */
  const handleCreateRoom = () => {
    socket.emit(MESSAGE.FETCH_LOBBY, (lobby: string[]) => {
      const room = createRoom(lobby);
      if (!room) {
        console.error('Host: Error creating room.');
        return;
      }
      // Register Host Information
      socket.emit(MESSAGE.FETCH_USERID, (userid: string) => {
        room.host = { userid: userid, username: username };
        // Update Server
        socket.emit(MESSAGE.CREATE_ROOM, {
          roomCode: room.roomCode,
          room: room,
        });
      });

      // Update Local
      setRoom(room);

      setLobby(lobby);
      addRoomCode(room.roomCode);

      setPageState(PAGESTATE.inGame);
    });
  };

  const handleBack = () => {
    console.log('Host: back');
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold mb-4'>Host Create Room</h1>
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
      <Button name='Create Room' onclick={handleCreateRoom} type='submit' />
      <Button name='Back' onclick={handleBack} type='submit' />
    </div>
  );
};

export default HostCreateRoom;
