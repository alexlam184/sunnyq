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
import {
  CHOICE,
  MultipleChoiceQuestion,
  BaseQuestion,
  QUESTION,
  TextInputQuestion,
  choice,
} from '@/src/lib/type';
import { copyFileSync } from 'fs';

const HostCreateRoom = () => {
  // use Zustand Stores
  const { setPageState } = usePageStateStore();
  const { setRoom, username, setUsername } = useRoomStore();
  const { createRoom, addRoomCode, setLobby } = useLobbyStore();

  const [question, setQuestion] = useState<BaseQuestion>({
    type: QUESTION.MultipleChoice,
    question:
      'Which of the following programming languages is primarily used for building web applications?',
    remark: '',
  });

  const [choices, setChoices] = useState<choice[]>([
    { value: CHOICE.A, content: 'Python' },
    { value: CHOICE.B, content: 'Java' },
    { value: CHOICE.C, content: 'JavaScript' },
    { value: CHOICE.D, content: 'C++' },
  ]);

  const [answer, setAnswer] = useState<CHOICE | string>(CHOICE.A);

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

        // Create a question object based on its type
        const createQuestionObject = (): BaseQuestion => {
          if (question.type === QUESTION.MultipleChoice) {
            return {
              ...question,
              choices: choices,
              answer: answer as CHOICE,
            } as MultipleChoiceQuestion;
          } else if (question.type === QUESTION.TextInput) {
            return {
              ...question,
              answer: answer as string,
            } as TextInputQuestion;
          }
          return question;
        };
        // Update Question
        room.question = createQuestionObject();

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
      // Change page
      setPageState(PAGESTATE.inGame);
    });
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
              defaultValue={username}
            />
            <TextAreaField
              title='Question'
              rows={3}
              onChange={(e) => {
                setQuestion({ ...question, question: e.target.value });
              }}
              defaultValue={question.question}
            />
            <TextAreaField
              title='Remark'
              rows={2}
              onChange={(e) => {
                setQuestion({ ...question, remark: e.target.value });
              }}
              defaultValue={question.remark}
            />
            {choices.map((choice, index) => {
              if (index % 2 === 1) return;
              // Check if the index is even and there is a next element
              if (index + 1 < choices.length) {
                const nextChoice = choices[index + 1];
                return (
                  <div
                    key={index}
                    className='flex space-x-1 items-center justify-center'
                  >
                    <TextAreaField
                      title={choice.value}
                      rows={3}
                      onChange={(e) =>
                        setChoices(
                          choices.map((c) =>
                            c.value === choice.value
                              ? { ...c, content: e.target.value }
                              : c
                          )
                        )
                      }
                      defaultValue={choice.content}
                    />
                    <TextAreaField
                      title={nextChoice.value}
                      rows={3}
                      onChange={(e) =>
                        setChoices(
                          choices.map((c) =>
                            c.value === choice.value
                              ? { ...c, content: e.target.value }
                              : c
                          )
                        )
                      }
                      defaultValue={nextChoice.content}
                    />
                  </div>
                );
              } else {
                // Render a single element for odd indices or when there is no next element
                return (
                  <div
                    key={index}
                    className='flex space-x-1 items-center justify-center'
                  >
                    <TextAreaField
                      title={choice.value}
                      rows={3}
                      onChange={() => {}}
                      defaultValue={choice.content}
                    />
                  </div>
                );
              }
            })}
            {/*             <div className='flex space-x-1 items-center justify-center'>
              <TextAreaField
                title='A'
                rows={3}
                onChange={(e) => {}}
                defaultValue={}
              />
              <TextAreaField
                title='B'
                rows={3}
                onChange={(e) => {
                  question.choices?.set(CHOICE.B, e.target.value);
                }}
                defaultValue={question.choices?.get(CHOICE.B)}
              />
            </div>
            <div className='flex space-x-1 items-center justify-center'>
              <TextAreaField
                title='C'
                rows={3}
                onChange={(e) => {
                  question.choices?.set(CHOICE.C, e.target.value);
                }}
                defaultValue={question.choices?.get(CHOICE.C)}
              />
              <TextAreaField
                title='D'
                rows={3}
                onChange={(e) => {
                  question.choices?.set(CHOICE.D, e.target.value);
                }}
                defaultValue={question.choices?.get(CHOICE.D)}
              />
            </div> */}
            <div className='flex items-center justify-end space-x-5'>
              <label className='text-black'>Correct Answer</label>
              <Select
                name='MC'
                options={options}
                onChange={(choice: Option) => {
                  setAnswer(choice.value);
                }}
                defaultValue={answer}
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
