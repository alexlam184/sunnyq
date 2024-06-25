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

  const BaseQuestionField = () => {
    return (
      <>
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
      </>
    );
  };

  const TypeChoosingField = () => {
    return (
      <div className='relative flex overflow-x-auto overflow-y-hidden border-gray-200 whitespace-nowrap dark:border-gray-700 justify-evenly'>
        <div
          className={`absolute bottom-0 h-0.5 bg-blue-500 transition-all duration-300 ease-in-out`}
        />
        <button
          onClick={() =>
            setQuestion({ ...question, type: QUESTION.MultipleChoice })
          }
          className={`inline-flex items-center h-10 px-4 text-sm text-center ${
            question.type === QUESTION.MultipleChoice
              ? 'text-blue-600 border-b-2 border-blue-500'
              : 'text-gray-700'
          } sm:text-base dark:text-blue-300 whitespace-nowrap focus:outline-none`}
        >
          {QUESTION.MultipleChoice}
        </button>
        <button
          onClick={() => setQuestion({ ...question, type: QUESTION.TextInput })}
          className={`inline-flex items-center h-10 px-4 text-sm text-center ${
            question.type === QUESTION.TextInput
              ? 'text-blue-600 border-b-2 border-blue-500'
              : 'text-gray-700'
          } sm:text-base dark:text-white whitespace-nowrap focus:outline-none`}
        >
          {QUESTION.TextInput}
        </button>
        <button
          onClick={() => setQuestion({ ...question, type: QUESTION.OpenEnd })}
          className={`inline-flex items-center h-10 px-4 text-sm text-center ${
            question.type === QUESTION.OpenEnd
              ? 'text-blue-600 border-b-2 border-blue-500'
              : 'text-gray-700'
          } sm:text-base dark:text-white whitespace-nowrap focus:outline-none`}
        >
          {QUESTION.OpenEnd}
        </button>
      </div>
    );
  };

  const MultipleChoiceField = () => {
    return (
      <>
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
                        c.value === nextChoice.value
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
              </div>
            );
          }
        })}
        <div className='flex items-center justify-end space-x-5'>
          <label className='text-black'>Correct Answer</label>
          <Select
            name='MC'
            options={options}
            onChange={(e) => {
              setAnswer(e.target.value);
            }}
            defaultValue={answer}
          />
        </div>
      </>
    );
  };

  const TextInputField = () => {
    return (
      <TextAreaField
        title='Answer'
        rows={3}
        onChange={(e) => {
          setAnswer(e.target.value);
        }}
        defaultValue={answer}
      />
    );
  };

  const OpenEndField = () => {
    return <></>;
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
            <BaseQuestionField />
            <TypeChoosingField />
          </div>
          {question.type === QUESTION.MultipleChoice ? (
            <MultipleChoiceField />
          ) : question.type === QUESTION.TextInput ? (
            <TextInputField />
          ) : question.type === QUESTION.OpenEnd ? (
            <OpenEndField />
          ) : (
            ''
          )}
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
