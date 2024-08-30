import { socket } from '@/src/lib/socket/socketio.service';
import { usePageStateStore } from '@/store/PageStateStroe';
import { PAGESTATE, MESSAGE } from '@/src/lib/enum';
import { useRoomStore } from '@/store/RoomStore';
import { useLobbyStore } from '@/store/LobbyStore';
import { useMemo, useCallback, useEffect, useState, useRef } from 'react';
import InputField from '../ui/InputField';
import Button from '../ui/Button';
import TextAreaField from '../ui/TextAreaField';
import { Select, SelectOption } from '../ui/Select';
import { CHOICE, BaseQuestion, QUESTION } from '@/src/lib/type';
import Tabs, { TabOption } from '../ui/Tabs';
import CollapsibleSection from '../ui/CollapsibleSection';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Toggle from '../ui/Toggle';

/**
 * Question Templates
 */
const sampleQuestion: BaseQuestion & { mcAnswer: string } = {
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
  answer: '',
  mcAnswer: CHOICE.A,
};

const emptyQuestion: BaseQuestion & { mcAnswer: string } = {
  type: QUESTION.MultipleChoice,
  question: '',
  remark: '',
  choices: [
    { value: CHOICE.A, content: '' },
    { value: CHOICE.B, content: '' },
    { value: CHOICE.C, content: '' },
    { value: CHOICE.D, content: '' },
  ],
  answer: '',
  mcAnswer: CHOICE.A,
};

const HostCreateRoom = () => {
  /**
   * Scroll Position Control
   */
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const scrollPosition = useRef<number>(0);
  useEffect(() => {
    // Restore scroll position
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollPosition.current;
    }
  }, [scrollRef, scrollPosition]);
  const handleScroll = () => {
    if (scrollRef.current) {
      scrollPosition.current = scrollRef.current.scrollTop;
    }
  };

  /**
   * Zustand Stores
   */
  const { setPageState } = usePageStateStore();
  const { setRoom, setUsername } = useRoomStore();
  const { createRoom, addRoomCode, setLobby } = useLobbyStore();

  /**
   * Handle Form
   */
  const validationSchema = yup.object().shape({
    username: yup.string().required('Username is required').default(''),
    showUserList: yup.bool().default(false),
    showAnswers: yup.bool().default(false),
    showStatistics: yup.bool().default(false),
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
        mcAnswer: yup.string(),
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
    append(emptyQuestion);
  };
  const handleRemoveField = (index: number) => {
    remove(index);
  };
  const onFormSubmit = (data: any) => {
    setUsername(data.username);
  };
  const username = watch('username');
  const questions = watch('questions');
  const showUserList = watch('showUserList');
  const showAnswers = watch('showAnswers');
  const showStatistics = watch('showStatistics');

  /**
   * Handle Room Events
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
        // Update Host
        room.host = { userid: userid, username: username };

        // Update Question
        room.questions = questions?.map(({ mcAnswer, ...rest }) => {
          if (rest.type === QUESTION.MultipleChoice) rest.answer = mcAnswer;
          return rest;
        }) as BaseQuestion[];

        // Update settings
        room.showUserList = showUserList;
        room.showAnswers = showAnswers;
        room.showStatistics = showStatistics;

        // Upload to Server
        socket.emit(MESSAGE.CREATE_ROOM, {
          roomCode: room.roomCode,
          room: room,
        });
        // Update Local
        setLobby(lobby);
        addRoomCode(room.roomCode);
        setRoom(room);

        // Change Page
        setPageState(PAGESTATE.inGame);
      });
    });
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
            onBlur={(e) =>
              setValue(`questions.${index}.remark`, e.target.value)
            }
          />
        </>
      );
    },
    [register, setValue]
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
          defaultValue={questions ? questions[index].type : emptyQuestion.type}
        />
      );
    },
    [register, tabOptions, questions, setValue]
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
                  onBlur={(e) =>
                    setValue(
                      `questions.${index}.choices.${choiceIndex}.content`,
                      e.target.value
                    )
                  }
                />
              );
            })}
          </div>
          <div className='flex items-center justify-end space-x-5'>
            <label className='text-black'>Correct Answer</label>
            <Select
              name={`questions.${index}.mcAnswer`}
              register={register}
              registerName={`questions.${index}.mcAnswer`}
              options={selectedOptions}
              onBlur={(e) =>
                setValue(`questions.${index}.mcAnswer`, e.target.value)
              }
              defaultValue={`questions.${index}.mcAnswer`}
            />
          </div>
        </>
      );
    },
    [selectedOptions, register, setValue]
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
          onBlur={(e) => setValue(`questions.${index}.answer`, e.target.value)}
        />
      );
    },
    [register, setValue]
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
          answer: answer,
          mcAnswer: answer,
          choices: [
            { value: CHOICE.A, content: choiceA },
            { value: CHOICE.B, content: choiceB },
            { value: CHOICE.C, content: choiceC },
            { value: CHOICE.D, content: choiceD },
          ],
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
      setCsvFile(null);
    }
  };

  /**
   * Subtitle
   */
  const SubTitle = ({ subtitle }: { subtitle: string }) => {
    return (
      <h2 className='mt-4 mb-2 leading-relaxed text-gray-500 font-bold'>
        {subtitle}
      </h2>
    );
  };

  return (
    <section ref={scrollRef} onScroll={handleScroll} className='bg-slate-100'>
      <div className='min-h-screen mx-auto max-w-screen-xl px-4 py-10 lg:py-32 lg:flex lg:items-start'>
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className='mx-auto max-w-xl'
        >
          <h1 className='text-3xl font-extrabold sm:text-5xl text-black'>
            Room Creator 🦑
          </h1>
          <SubTitle subtitle='Basic' />
          <InputField
            name={`username`}
            register={register}
            registerName={`username`}
            type='text'
            title='Name'
            defaultValue={username}
            onBlur={(e) => setValue(`username`, e.target.value)}
          />
          <SubTitle subtitle='Setting' />
          <div className='p-2 grid gap-2 grid-cols-2'>
            <div className='flex items-center justify-evenly space-x-2'>
              <span className='text-black text-md'>Show User List</span>
              <Toggle
                activeColor='blue'
                onClick={(e) => {
                  setValue('showUserList', e.currentTarget.checked);
                }}
              />
            </div>
            <div className='flex items-center justify-evenly space-x-2'>
              <span className='text-black text-md'>Show Answers</span>
              <Toggle
                activeColor='blue'
                onClick={(e) => {
                  setValue('showAnswers', e.currentTarget.checked);
                }}
              />
            </div>
            <div className='flex items-center justify-evenly space-x-2'>
              <span className='text-black text-md'>Show Statistics</span>
              <Toggle
                activeColor='blue'
                onClick={(e) => {
                  setValue('showStatistics', e.currentTarget.checked);
                }}
              />
            </div>
          </div>
          <SubTitle subtitle='CSV Import' />
          <div className='p-4 flex-none flex-col items-center justify-center space-y-3'>
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
          <SubTitle subtitle='Question' />
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
