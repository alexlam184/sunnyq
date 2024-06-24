import { socket } from '@/src/lib/socket/socketio.service';
import { usePageStateStore } from '@/store/PageStateStroe';
import { PAGESTATE, MESSAGE } from '@/src/lib/enum';
import { useRoomStore } from '@/store/RoomStore';
import { useLobbyStore } from '@/store/LobbyStore';
import { useState } from 'react';
import InputField from '../ui/InputField';
import Button from '../ui/Button';
import TextAreaField from '../ui/TextAreaField';
import { Select, Option } from '../ui/Select';
import { CHOICE, MultipleChoice, TextInput } from '@/src/lib/type';

const HostCreateRoom = () => {
  // use Zustand Stores
  const { setPageState } = usePageStateStore();
  const { setRoom } = useRoomStore();
  const { createRoom, addRoomCode, setLobby } = useLobbyStore();

  const [username, setUsername] = useState('');
  const [question, setQuestion] = useState<MultipleChoice | TextInput>({
    type: 'mc',
    question:
      'Which of the following programming languages is primarily used for building web applications?',
    remark: '',
    choices: [
      { value: CHOICE.A, content: 'Python' },
      { value: CHOICE.B, content: 'Java' },
      { value: CHOICE.C, content: 'JavaScript' },
      { value: CHOICE.D, content: 'C++' },
    ],
    answer: CHOICE.C,
  });

  const options: Option[] = [
    { value: CHOICE.A, label: 'A' },
    { value: CHOICE.B, label: 'B' },
    { value: CHOICE.C, label: 'C' },
    { value: CHOICE.D, label: 'D' },
  ];

  const handleCreateRoom = () => {
    socket.emit(MESSAGE.FETCH_LOBBY, (lobby: string[]) => {
      const room = createRoom(lobby);
      if (!room) {
        console.error('Host: Error creating room.');
        return;
      }
      // Register Host Information
      socket.emit(MESSAGE.FETCH_USERID, (userid: string) => {
        // Update Host
        room.host = { userid: userid, username: username };

        // Update Question
        room.question = question;

        // Upload to Server
        socket.emit(MESSAGE.CREATE_ROOM, {
          roomCode: room.roomCode,
          room: room,
        });

        // Update Local
        setLobby(lobby);
        addRoomCode(room.roomCode);
        setRoom(room);
      });
    });
    // Change page
    setPageState(PAGESTATE.inGame);
  };

  const handleBack = () => {
    // Change page
    setPageState(PAGESTATE.front);
  };

  return (
    <section className='bg-white'>
      <div className='mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-start'>
        <div className='mx-auto max-w-xl'>
          <h1 className='text-3xl font-extrabold sm:text-5xl text-black'>
            Room Creator 🦑
          </h1>
          <p className='mt-4 mb-2 leading-relaxed text-gray-500'>
            Design and build a room
          </p>
          <div className='my-2 flex-wrap gap-4 justify-center space-y-3'>
            <InputField
              type='text'
              title='Name'
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              value={username}
            />
            <TextAreaField
              title='Question'
              rows={3}
              onChange={(e) => {
                setQuestion({ ...question, question: e.target.value });
              }}
              value={question.question}
            />
            <TextAreaField
              title='Remark'
              rows={2}
              onChange={(e) => {
                setQuestion({ ...question, remark: e.target.value });
              }}
              value={question.remark}
            />
            <div className='flex space-x-1 items-center justify-center'>
              <TextAreaField
                title='A'
                rows={3}
                onChange={(e) => {
                  if (!('choices' in question)) return;
                  const choices = [...question.choices];
                  choices[CHOICE.A].content = e.target.value;
                  setQuestion({ ...question, choices });
                }}
                value={
                  'choices' in question
                    ? question.choices[CHOICE.A].content
                    : ''
                }
              />
              <TextAreaField
                title='B'
                rows={3}
                onChange={(e) => {
                  if (!('choices' in question)) return;
                  const choices = [...question.choices];
                  choices[CHOICE.B].content = e.target.value;
                  setQuestion({ ...question, choices });
                }}
                value={
                  'choices' in question
                    ? question.choices[CHOICE.B].content
                    : ''
                }
              />
            </div>
            <div className='flex space-x-1 items-center justify-center'>
              <TextAreaField
                title='C'
                rows={3}
                onChange={(e) => {
                  if (!('choices' in question)) return;
                  const choices = [...question.choices];
                  choices[CHOICE.C].content = e.target.value;
                  setQuestion({ ...question, choices });
                }}
                value={
                  'choices' in question
                    ? question.choices[CHOICE.C].content
                    : ''
                }
              />
              <TextAreaField
                title='D'
                rows={3}
                onChange={(e) => {
                  if (!('choices' in question)) return;
                  const choices = [...question.choices];
                  choices[CHOICE.D].content = e.target.value;
                  setQuestion({ ...question, choices });
                }}
                value={
                  'choices' in question
                    ? question.choices[CHOICE.D].content
                    : ''
                }
              />
            </div>
            <div className='flex items-center justify-end space-x-5'>
              <label className='text-black'>Correct Answer</label>
              <Select
                name='MC'
                options={options}
                onChange={(choice: Option) => {
                  if (!('choices' in question)) return;
                  setQuestion({ ...question, answer: choice.value as CHOICE });
                }}
                value={question.answer}
              />
            </div>
          </div>

          <div className='mt-8 flex flex-wrap gap-4 justify-center'>
            <Button
              buttonText='Create'
              onClick={handleCreateRoom}
              buttonType='base'
            />
            <Button
              buttonText='Back'
              onClick={handleBack}
              buttonType='border'
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HostCreateRoom;
