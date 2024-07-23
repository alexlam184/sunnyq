import { socket } from '@/src/lib/socket/socketio.service';
import { usePageStateStore } from '@/store/PageStateStroe';
import { PAGESTATE, MESSAGE } from '@/src/lib/enum';
import { useRoomStore } from '@/store/RoomStore';
import { useLobbyStore } from '@/store/LobbyStore';
import { useMemo, useState, useCallback } from 'react';
import InputField from '../ui/InputField';
import Button from '../ui/Button';
import TextAreaField from '../ui/TextAreaField';
import { Select, SelectOption } from '../ui/Select';
import {
  CHOICE,
  MultipleChoiceQuestion,
  BaseQuestion,
  QUESTION,
  TextInputQuestion,
  choice,
  OpenEndQuestion,
} from '@/src/lib/type';
import { useImmer } from 'use-immer';
import Tabs, { TabOption } from '../ui/Tabs';

const HostCreateRoom = () => {
  // use Zustand Stores
  const { setPageState } = usePageStateStore();
  const { setRoom, username, setUsername } = useRoomStore();
  const { createRoom, addRoomCode, setLobby } = useLobbyStore();

  const [question, updateQuestion] = useImmer<BaseQuestion>({
    type: QUESTION.MultipleChoice,
    question:
      'Which of the following programming languages is primarily used for building web applications?',
    remark:
      "Remember the acronym 'JS' which stands for JavaScript, as it is the go-to language for web application development due to its versatility and widespread support in browsers.",
  });

  const [choices, updateChoices] = useImmer<choice[]>([
    { value: CHOICE.A, content: 'Python' },
    { value: CHOICE.B, content: 'Java' },
    { value: CHOICE.C, content: 'JavaScript' },
    { value: CHOICE.D, content: 'C++' },
  ]);

  const [choiceAnswer, setChoiceAnswer] = useState<CHOICE>(CHOICE.C);
  const [textAnswer, setTextAnswer] = useState<string>('JavaScript');

  const selectedOptions: SelectOption[] = useMemo(() => {
    return [
      { value: CHOICE.A, label: 'A' },
      { value: CHOICE.B, label: 'B' },
      { value: CHOICE.C, label: 'C' },
      { value: CHOICE.D, label: 'D' },
    ];
  }, []);

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
          switch (question.type) {
            case QUESTION.OpenEnd:
              return question as OpenEndQuestion;
            case QUESTION.MultipleChoice:
              return {
                ...question,
                choices: choices,
                answer: choiceAnswer,
              } as MultipleChoiceQuestion;
            case QUESTION.TextInput:
              return {
                ...question,
                answer: textAnswer,
              } as TextInputQuestion;
            default:
              return question;
          }
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

  const BaseQuestionField = useCallback(() => {
    return (
      <>
        <TextAreaField
          title='Question'
          rows={3}
          onChange={(e) => {
            updateQuestion((draft) => {
              draft.question = e.target.value;
            });
          }}
          defaultValue={question.question}
        />
        <TextAreaField
          title='Remark'
          rows={2}
          onChange={(e) => {
            updateQuestion((draft) => {
              draft.remark = e.target.value;
            });
          }}
          defaultValue={question.remark}
        />
      </>
    );
  }, [question.question, question.remark, updateQuestion]);

  const tabOptions: TabOption[] = useMemo(() => {
    return [
      { value: QUESTION.MultipleChoice, label: QUESTION.MultipleChoice },
      { value: QUESTION.TextInput, label: QUESTION.TextInput },
      { value: QUESTION.OpenEnd, label: QUESTION.OpenEnd },
    ];
  }, []);

  const TypeChoosingField = useCallback(() => {
    return (
      <Tabs
        options={tabOptions}
        onChange={(option) => {
          updateQuestion((draft) => {
            draft.type = option.value;
          });
        }}
        defaultValue={question.type}
      />
    );
  }, [question.type, tabOptions, updateQuestion]);

  const MultipleChoiceField = useCallback(() => {
    return (
      <>
        {choices.map((choice, index) => {
          if (index % 2 !== 0) return null;
          const nextChoice = choices[index + 1];

          return (
            <div
              key={index}
              className='flex space-x-1 items-center justify-start'
            >
              <TextAreaField
                title={choice.value}
                rows={3}
                onChange={(e) =>
                  updateChoices((draft) => {
                    draft[index].content = e.target.value;
                  })
                }
                defaultValue={choice.content}
              />
              {nextChoice && (
                <TextAreaField
                  title={nextChoice.value}
                  rows={3}
                  onChange={(e) =>
                    updateChoices((draft) => {
                      draft[index + 1].content = e.target.value;
                    })
                  }
                  defaultValue={nextChoice.content}
                />
              )}
            </div>
          );
        })}

        <div className='flex items-center justify-end space-x-5'>
          <label className='text-black'>Correct Answer</label>
          <Select
            name='MC'
            options={selectedOptions}
            onChange={(e) => {
              setChoiceAnswer(e.target.value as CHOICE);
            }}
            defaultValue={choiceAnswer}
          />
        </div>
      </>
    );
  }, [choiceAnswer, choices, selectedOptions, updateChoices]);

  const TextInputField = useCallback(() => {
    return (
      <TextAreaField
        title='Answer'
        rows={3}
        onChange={(e) => {
          setTextAnswer(e.target.value);
        }}
        defaultValue={textAnswer}
      />
    );
  }, [textAnswer]);

  const OpenEndField = () => {
    return null;
  };

  return (
    <section className='bg-slate-100'>
      <div className='min-h-screen mx-auto max-w-screen-xl px-4 py-10 lg:py-32 lg:flex lg:items-start'>
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
          ) : null}
          <div className='mt-8 flex flex-wrap gap-4 justify-center'>
            <Button
              buttonText='Create'
              onClick={handleCreateRoom}
              buttonType='base'
              themeColor='blue'
            />
            <Button
              buttonText='Back'
              onClick={handleBack}
              buttonType='border'
              themeColor='blue'
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HostCreateRoom;
