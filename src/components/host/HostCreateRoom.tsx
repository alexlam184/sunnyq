import { socket } from '@/src/lib/socket/socketio.service';
import { usePageStateStore } from '@/store/PageStateStroe';
import { PAGESTATE, MESSAGE } from '@/src/lib/enum';
import { useRoomStore } from '@/store/RoomStore';
import { useLobbyStore } from '@/store/LobbyStore';
import { useMemo, useCallback, useEffect, useState } from 'react';
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
import Tabs, { TabOption } from '../ui/Tabs';
import CollapsibleSection from '../ui/CollapsibleSection';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

/**
 * Question Templates
 */
const sampleQuestion: BaseQuestion = {
  type: QUESTION.MultipleChoice,
  question:
    'Which of the following programming languages is primarily used for building web applications?',
  remark:
    "Remember the acronym 'JS' which stands for JavaScript, as it is the go-to language for web application development due to its versatility and widespread support in browsers.",
  choices: [
    { value: CHOICE.A, content: 'Python' },
    { value: CHOICE.B, content: 'Java' },
    { value: CHOICE.C, content: 'JavaScript' },
    { value: CHOICE.D, content: 'C++' },
  ],
  answer: CHOICE.C,
};

const emptyQuestion: BaseQuestion = {
  type: QUESTION.MultipleChoice,
  question: '',
  remark: '',
  choices: [
    { value: CHOICE.A, content: '' },
    { value: CHOICE.B, content: '' },
    { value: CHOICE.C, content: '' },
    { value: CHOICE.D, content: '' },
  ],
  answer: undefined,
};

const HostCreateRoom = () => {
  /**
   * Zustand Stores
   */
  const { setPageState } = usePageStateStore();
  const { setRoom, username, setUsername } = useRoomStore();
  const { createRoom, addRoomCode, setLobby } = useLobbyStore();

  /**
   * Handle Form
   */
  const validationSchema = yup.object().shape({
    username: yup.string().required('Username is required'),
    questions: yup.array().of(
      yup.object().shape({
        type: yup.string().required('Type is required'),
        question: yup.string().required('Question is required'),
        remark: yup.string(),
        choices: yup
          .array()
          .of(
            yup.object().shape({ value: yup.string(), content: yup.string() })
          ),
        answer: yup.string(),
      })
    ),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState,
    watch,
    setValue,
    getValues,
  } = useForm(formOptions);
  const { errors } = formState;
  const { fields, append, remove } = useFieldArray({
    name: 'questions',
    control,
  });
  const handleAppendField = () => {
    append(sampleQuestion);
  };
  const handleRemoveField = (index: number) => {
    remove(index);
  };
  const onFormSubmit = (data: any) => {
    setUsername(data.username);
  };
  const questions = watch('questions');

  /**
   * Handle Room Events
   */
  // Change Page after room is initiated
  const { room } = useRoomStore();
  const [canChangePage, setCanChangePage] = useState(false);
  useEffect(() => {
    if (!canChangePage) return;
    setPageState(PAGESTATE.inGame);
  }, [room]);

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
        room.questions = questions as BaseQuestion[];

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
    setCanChangePage(true);
  };
  const handleBack = () => {
    // Change page
    setPageState(PAGESTATE.front);
  };

  /**
   * Handle Question and Remark Field
   */
  const BaseQuestionField = useCallback(
    ({ index }: { index: number }) => {
      return (
        <>
          <TextAreaField
            name={`questions.${index}.question`}
            register={register}
            registerName={`questions.${index}.question`}
            title='Question'
            rows={3}
            onBlur={(e) =>
              setValue(`questions.${index}.question`, e.target.value)
            }
          />
          <TextAreaField
            name={`questions.${index}.remark`}
            register={register}
            registerName={`questions.${index}.remark`}
            title='Remark'
            rows={2}
          />
        </>
      );
    },
    [register]
  );

  /**
   * Handle Question Type Selection Field
   */
  const tabOptions: TabOption[] = useMemo(() => {
    return [
      { value: QUESTION.MultipleChoice, label: QUESTION.MultipleChoice },
      { value: QUESTION.TextInput, label: QUESTION.TextInput },
      { value: QUESTION.OpenEnd, label: QUESTION.OpenEnd },
    ];
  }, []);
  const TypeChoosingField = useCallback(
    ({ index }: { index: number }) => {
      return (
        <Tabs
          onChange={(option: TabOption) => {
            register(`questions.${index}.type`, option.value);
            setValue(`questions.${index}.type`, option.value);
          }}
          options={tabOptions}
          defaultValue={questions ? questions[index].type : sampleQuestion.type}
        />
      );
    },
    [register, tabOptions, questions]
  );

  /**
   * Handle MC Question Answer Field
   */
  const selectedOptions: SelectOption[] = useMemo(() => {
    return [
      { value: CHOICE.A, label: 'A' },
      { value: CHOICE.B, label: 'B' },
      { value: CHOICE.C, label: 'C' },
      { value: CHOICE.D, label: 'D' },
    ];
  }, []);
  const MultipleChoiceField = useCallback(
    ({ index }: { index: number }) => {
      return (
        <>
          <div className='grid grid-cols-2 gap-2'>
            {selectedOptions.map((choice, choiceIndex) => {
              return (
                <TextAreaField
                  key={choice.label}
                  name={`questions.${index}.choices.${choiceIndex}.content`}
                  register={register}
                  registerName={`questions.${index}.choices.${choiceIndex}.content`}
                  title={choice.label}
                  rows={3}
                />
              );
            })}
          </div>
          <div className='flex items-center justify-end space-x-5'>
            <label className='text-black'>Correct Answer</label>
            <Select
              name={`questions.${index}.answer`}
              register={register}
              registerName={`questions.${index}.answer`}
              options={selectedOptions}
            />
          </div>
        </>
      );
    },
    [selectedOptions, register]
  );

  /**
   * Handle Text Input Question Answer Field
   */
  const TextInputField = useCallback(
    ({ index }: { index: number }) => {
      return (
        <TextAreaField
          name={`questions.${index}.answer`}
          register={register}
          registerName={`questions.${index}.answer`}
          title='Answer'
          rows={3}
        />
      );
    },
    [register]
  );

  /**
   * Handle OpenEnd Question Answer Field
   */
  const OpenEndField = () => {
    return null;
  };

  /**
   * Handle CSV Import
   */
  const [csvFile, setCsvFile] = useState(null);

  const handleFileChange = (event: any) => {
    setCsvFile(event.target.files[0]);
  };

  const parseCSV = (content: any) => {
    const lines = content.split('\n');
    const questions = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        const fields = line
          .split(',')
          .map((field: any) => field.trim().replace(/^"|"$/g, ''));
        const [
          type,
          question,
          remark,
          answer,
          choiceA,
          choiceB,
          choiceC,
          choiceD,
        ] = fields;

        const newQuestion = {
          type: type,
          question: question,
          remark: remark,
          choices: [
            { value: CHOICE.A, content: choiceA },
            { value: CHOICE.B, content: choiceB },
            { value: CHOICE.C, content: choiceC },
            { value: CHOICE.D, content: choiceD },
          ],
          answer: answer,
        };

        questions.push(newQuestion);
      }
    }

    return questions;
  };

  const handleImportCSV = () => {
    if (csvFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const content = e.target.result;
        const importedQuestions = parseCSV(content);
        append(importedQuestions);
      };
      reader.readAsText(csvFile);
    }
  };

  return (
    <section className='bg-slate-100'>
      <div className='min-h-screen mx-auto max-w-screen-xl px-4 py-10 lg:py-32 lg:flex lg:items-start'>
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className='mx-auto max-w-xl'
        >
          <h1 className='text-3xl font-extrabold sm:text-5xl text-black'>
            Room Creator 🦑
          </h1>
          <p className='mt-4 mb-2 leading-relaxed text-gray-500'>
            Design and build a room
          </p>
          <InputField
            name={`username`}
            register={register}
            registerName={`username`}
            type='text'
            title='Name'
            defaultValue={username}
          />
          <div className='mt-4'>
            <input
              className='text-black'
              type='file'
              accept='.csv'
              onChange={handleFileChange}
            />
            <Button
              buttonText='Import CSV'
              onClick={handleImportCSV}
              buttonType='border'
              themeColor='blue'
              disabled={!csvFile}
            />
          </div>
          <div className='flex flex-col items-center justify-center space-y-2 mt-2 lg:min-w-[472px]'>
            {fields.length > 0 &&
              fields.map((field, index) => (
                <CollapsibleSection
                  key={field.id || index}
                  title={`${index + 1}. ${questions && questions[index].question}`}
                  deleteAction={() => handleRemoveField(index)}
                >
                  <div className='my-2 flex-wrap gap-4 justify-center space-y-3'>
                    <TypeChoosingField index={index} />
                    <BaseQuestionField index={index} />
                    {questions && questions[index] ? (
                      questions[index].type === QUESTION.MultipleChoice ? (
                        <MultipleChoiceField index={index} />
                      ) : questions[index].type === QUESTION.TextInput ? (
                        <TextInputField index={index} />
                      ) : questions[index].type === QUESTION.OpenEnd ? (
                        <OpenEndField />
                      ) : null
                    ) : null}
                  </div>
                </CollapsibleSection>
              ))}
          </div>
          <div className='p-2 flex justify-center'>
            <Button
              buttonText='Add Question'
              onClick={handleAppendField}
              buttonType='border'
              themeColor='blue'
            />
          </div>
          <div className='mt-8 flex flex-wrap gap-4 justify-center'>
            <Button
              type='submit'
              buttonText='Create Room'
              onClick={handleCreateRoom}
              buttonType='base'
              themeColor='blue'
              disabled={fields.length <= 0}
            />
            <Button
              buttonText='Back'
              onClick={handleBack}
              buttonType='border'
              themeColor='blue'
            />
          </div>
        </form>
      </div>
    </section>
  );
};
export default HostCreateRoom;
