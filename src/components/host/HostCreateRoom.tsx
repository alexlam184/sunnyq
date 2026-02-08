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
import { signIn, useSession } from 'next-auth/react';

declare global {
  interface Window {
    gapi?: any;
    google?: any;
  }
}

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
  const { data: session } = useSession();
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

  const [driveSaveState, setDriveSaveState] = useState<{
    status: 'idle' | 'saving' | 'done' | 'error';
    message?: string;
    fileUrl?: string;
  }>({ status: 'idle' });
  const [driveSaveFolder, setDriveSaveFolder] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [driveSavePending, setDriveSavePending] = useState(false);

  const handleExportCSV = () => {
    const currentQuestions = getValues('questions') || [];
    if (!currentQuestions.length) return;
    const header = [
      'type',
      'question',
      'remark',
      'answer',
      'choiceA',
      'choiceB',
      'choiceC',
      'choiceD',
    ];
    const escape = (value: string | undefined) => {
      const safe = (value ?? '').replace(/"/g, '""');
      return `"${safe}"`;
    };
    const rows = currentQuestions.map((q: any) => {
      const answer =
        q.type === QUESTION.MultipleChoice ? q.mcAnswer ?? q.answer : q.answer;
      return [
        q.type,
        q.question,
        q.remark,
        answer,
        q.choices?.[0]?.content,
        q.choices?.[1]?.content,
        q.choices?.[2]?.content,
        q.choices?.[3]?.content,
      ]
        .map(escape)
        .join(',');
    });
    const csv = [header.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const roomName = (getValues('username') || '').trim();
    const safeRoomName = roomName
      ? roomName.replace(/[\\/:*?"<>|]+/g, '-')
      : 'sunnyq-question-bank';
    link.download = `${safeRoomName}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleSaveToGoogleDrive = async () => {
    const currentQuestions = getValues('questions') || [];
    if (!currentQuestions.length) return;
    if (!session?.accessToken) {
      signIn('google', { callbackUrl: '/host?pagestate=createRoom' });
      setPageState(PAGESTATE.createRoom);
      return;
    }

    setDriveSaveState({ status: 'saving' });
    try {
      const header = [
        'type',
        'question',
        'remark',
        'answer',
        'choiceA',
        'choiceB',
        'choiceC',
        'choiceD',
      ];
      const rows = currentQuestions.map((q: any) => {
        const answer =
          q.type === QUESTION.MultipleChoice
            ? q.mcAnswer ?? q.answer
            : q.answer;
        return [
          q.type ?? '',
          q.question ?? '',
          q.remark ?? '',
          answer ?? '',
          q.choices?.[0]?.content ?? '',
          q.choices?.[1]?.content ?? '',
          q.choices?.[2]?.content ?? '',
          q.choices?.[3]?.content ?? '',
        ];
      });

      const escape = (value: string | undefined) => {
        const safe = (value ?? '').replace(/"/g, '""');
        return `"${safe}"`;
      };
      const csv = [
        header.join(','),
        ...rows.map((row) => row.map(escape).join(',')),
      ].join('\n');

      const boundary = `-------sunnyq-${Date.now()}`;
      const roomName = (getValues('username') || '').trim();
      const safeRoomName = roomName
        ? roomName.replace(/[\\/:*?"<>|]+/g, '-')
        : 'sunnyq-question-bank';
      const metadata: { name: string; mimeType: string; parents?: string[] } = {
        name: `${safeRoomName}.csv`,
        mimeType: 'text/csv',
      };
      if (driveSaveFolder?.id) {
        metadata.parents = [driveSaveFolder.id];
      }
      const multipartBody =
        `--${boundary}\r\n` +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        `${JSON.stringify(metadata)}\r\n` +
        `--${boundary}\r\n` +
        'Content-Type: text/csv\r\n\r\n' +
        `${csv}\r\n` +
        `--${boundary}--`;

      const uploadResponse = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            'Content-Type': `multipart/related; boundary=${boundary}`,
          },
          body: multipartBody,
        }
      );
      if (!uploadResponse.ok) throw new Error('Failed to upload CSV to Drive');
      const created = await uploadResponse.json();
      const fileId = created.id as string;
      const fileUrl = `https://drive.google.com/file/d/${fileId}/view`;
      setDriveSaveState({
        status: 'done',
        message: 'Saved to Google Drive.',
        fileUrl,
      });
    } catch (error) {
      setDriveSaveState({
        status: 'error',
        message: 'Failed to save to Google Drive.',
      });
    }
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
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [driveError, setDriveError] = useState<string | null>(null);
  const pickerLoadedRef = useRef(false);
  const pickerLoadingRef = useRef<Promise<void> | null>(null);
  const driveImportPendingKey = 'driveImportPending';

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setCsvFile(file);
  };

  const getRoomNameFromFile = (filename?: string) => {
    if (!filename) return '';
    const name = filename.replace(/\.[^/.]+$/, '');
    return name.trim();
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
      const roomName = getRoomNameFromFile(csvFile.name);
      if (roomName) setValue('username', roomName);
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

  const handleDriveFileImport = async (file: {
    id: string;
    name: string;
    mimeType: string;
  }) => {
    if (!session?.accessToken) return;
    const roomName = getRoomNameFromFile(file.name);
    if (roomName) setValue('username', roomName);
    setDriveError(null);
    try {
      const isSpreadsheet =
        file.mimeType === 'application/vnd.google-apps.spreadsheet';
      const url = isSpreadsheet
        ? `https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=text/csv&supportsAllDrives=true`
        : `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media&supportsAllDrives=true`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
      if (!response.ok) {
        let details = '';
        try {
          const errorBody = await response.json();
          const message = errorBody?.error?.message;
          if (message) details = ` (${message})`;
        } catch (error) {
          // ignore JSON parse errors
        }
        throw new Error(
          `Failed to download CSV. Status ${response.status}${details}`
        );
      }
      const content = await response.text();
      const importedQuestions = parseCSV(content);
      append(importedQuestions);
    } catch (error) {
      setDriveError(
        error instanceof Error
          ? error.message
          : 'Failed to import CSV from Google Drive.'
      );
    }
  };

  const loadPicker = () => {
    if (pickerLoadedRef.current) return Promise.resolve();
    if (pickerLoadingRef.current) return pickerLoadingRef.current;

    pickerLoadingRef.current = new Promise<void>((resolve, reject) => {
      const existing = document.querySelector('script[data-gapi]');
      if (existing) {
        const checkReady = () => {
          if (window.gapi) {
            window.gapi.load('picker', {
              callback: () => {
                pickerLoadedRef.current = true;
                resolve();
              },
            });
          } else {
            setTimeout(checkReady, 100);
          }
        };
        checkReady();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.async = true;
      script.defer = true;
      script.setAttribute('data-gapi', 'true');
      script.onload = () => {
        window.gapi.load('picker', {
          callback: () => {
            pickerLoadedRef.current = true;
            resolve();
          },
        });
      };
      script.onerror = () => reject(new Error('Failed to load Google Picker'));
      document.body.appendChild(script);
    });

    return pickerLoadingRef.current;
  };

  const openGooglePicker = async () => {
    if (!session?.accessToken) return;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY ?? '';
    const appId = process.env.NEXT_PUBLIC_GOOGLE_APP_ID ?? '';
    if (!apiKey || !appId) {
      setDriveError('Missing Google Picker API key or App ID.');
      return;
    }
    try {
      await loadPicker();
      const google = window.google;
      if (!google?.picker) throw new Error('Google Picker is unavailable.');

      const view = new google.picker.DocsView()
        .setMimeTypes('text/csv,application/vnd.google-apps.spreadsheet')
        .setIncludeFolders(false)
        .setSelectFolderEnabled(false);

      const picker = new google.picker.PickerBuilder()
        .setDeveloperKey(apiKey)
        .setAppId(appId)
        .setOAuthToken(session.accessToken)
        .setTitle('Select CSV from Google Drive')
        .addView(view)
        .setCallback((data: any) => {
          if (
            data.action === google.picker.Action.PICKED &&
            data.docs?.length
          ) {
            const picked = data.docs[0];
            handleDriveFileImport({
              id: picked.id,
              name: picked.name,
              mimeType: picked.mimeType,
            });
          }
        })
        .build();

      picker.setVisible(true);
    } catch (error) {
      setDriveError(
        error instanceof Error ? error.message : 'Failed to open Google Picker.'
      );
    }
  };

  const openGoogleFolderPicker = async (
    onPicked?: (folder: { id: string; name: string }) => void
  ) => {
    if (!session?.accessToken) return;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY ?? '';
    const appId = process.env.NEXT_PUBLIC_GOOGLE_APP_ID ?? '';
    if (!apiKey || !appId) {
      setDriveError('Missing Google Picker API key or App ID.');
      return;
    }
    try {
      await loadPicker();
      const google = window.google;
      if (!google?.picker) throw new Error('Google Picker is unavailable.');

      const view = new google.picker.DocsView(google.picker.ViewId.FOLDERS)
        .setIncludeFolders(true)
        .setSelectFolderEnabled(true);

      const picker = new google.picker.PickerBuilder()
        .setDeveloperKey(apiKey)
        .setAppId(appId)
        .setOAuthToken(session.accessToken)
        .setTitle('Select Destination Folder')
        .addView(view)
        .setCallback((data: any) => {
          if (
            data.action === google.picker.Action.PICKED &&
            data.docs?.length
          ) {
            const picked = data.docs[0];
            const folder = { id: picked.id, name: picked.name };
            setDriveSaveFolder(folder);
            if (onPicked) onPicked(folder);
          }
        })
        .build();

      picker.setVisible(true);
    } catch (error) {
      setDriveError(
        error instanceof Error ? error.message : 'Failed to open Google Picker.'
      );
    }
  };

  const handleImportFromDrive = () => {
    if (!session?.accessToken) {
      sessionStorage.setItem(driveImportPendingKey, '1');
      signIn('google', { callbackUrl: '/host?pagestate=createRoom' });
      return;
    }
    openGooglePicker();
  };

  useEffect(() => {
    if (!session?.accessToken) return;
    const pending = sessionStorage.getItem(driveImportPendingKey);
    if (pending) {
      sessionStorage.removeItem(driveImportPendingKey);
      openGooglePicker();
    }
  }, [session?.accessToken]);

  const handleChooseFolderAndSave = () => {
    if (!session?.accessToken) {
      signIn('google', { callbackUrl: '/host?pagestate=createRoom' });
      return;
    }
    if (driveSaveFolder) {
      handleSaveToGoogleDrive();
      return;
    }
    setDriveSavePending(true);
    openGoogleFolderPicker(() => {
      setDriveSavePending(false);
      handleSaveToGoogleDrive();
    });
  };

  /**
   * Subtitle
   */
  const SubTitle = ({ subtitle }: { subtitle: string }) => {
    return (
      <h2 className='mt-6 mb-2 leading-relaxed text-rose-500 font-extrabold tracking-wide'>
        {subtitle}
      </h2>
    );
  };

  return (
    <section
      ref={scrollRef}
      onScroll={handleScroll}
      className='relative overflow-hidden bg-gradient-to-br from-yellow-100 via-pink-100 to-sky-100'
    >
      <div className='pointer-events-none absolute -top-16 -left-12 h-56 w-56 rounded-full bg-yellow-300/40 blur-3xl' />
      <div className='pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-sky-300/40 blur-3xl' />
      <div className='min-h-screen mx-auto max-w-screen-xl px-4 py-10 lg:py-24 lg:flex lg:items-start'>
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className='relative z-10 mx-auto w-full max-w-2xl rounded-3xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur sm:p-8'
        >
          <h1 className='text-3xl font-black sm:text-5xl text-slate-900'>
            Room Creator 🧩
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
            <div className='flex flex-wrap items-center justify-center gap-3'>
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
            <div className='text-xs font-semibold uppercase tracking-wide text-rose-500 text-center'>
              or
            </div>
            <div className='flex justify-center'>
              <Button
                buttonText='Import from Google Drive'
                onClick={handleImportFromDrive}
                buttonType='border'
                themeColor='blue'
              />
            </div>
            {driveError ? (
              <div className='mt-2 text-sm text-red-500'>{driveError}</div>
            ) : null}
          </div>
          <div className='bg-slate-100 rounded-lg p-1'>
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
              type='button'
              buttonText='Add Question'
              onClick={handleAppendField}
              buttonType='border'
              themeColor='blue'
            />
            </div>
          </div>
          <div className='mt-8 flex flex-col items-center gap-4'>
            <div className='flex flex-wrap justify-center gap-4'>
              <Button
                type='submit'
                buttonText='Create Room'
                onClick={handleCreateRoom}
                buttonType='base'
                themeColor='blue'
                disabled={fields.length <= 0}
              />
            </div>
            <div className='flex flex-wrap justify-center gap-4'>
              <Button
                buttonText='Download Question as CSV'
                onClick={handleExportCSV}
                buttonType='border'
                themeColor='blue'
                disabled={fields.length <= 0}
              />
              <Button
                buttonText={
                  driveSavePending
                    ? 'Choose Folder...'
                    : 'Save Question to Google Drive'
                }
                onClick={handleChooseFolderAndSave}
                buttonType='border'
                themeColor='blue'
                disabled={
                  fields.length <= 0 || driveSaveState.status === 'saving'
                }
              />
            </div>
            <div className='flex flex-wrap justify-center gap-4'>
              <Button
                buttonText='Back'
                onClick={handleBack}
                buttonType='border'
                themeColor='blue'
              />
            </div>
          </div>
          {driveSaveFolder ? (
            <div className='mt-2 text-center text-xs text-gray-500'>
              Saving to: {driveSaveFolder.name}
            </div>
          ) : null}
          {driveSaveState.status !== 'idle' ? (
            <div className='mt-3 text-center text-sm text-gray-600'>
              {driveSaveState.status === 'saving'
                ? 'Saving to Google Drive...'
                : driveSaveState.message}
              {driveSaveState.fileUrl ? (
                <div>
                  <a
                    className='text-blue-600 underline'
                    href={driveSaveState.fileUrl}
                    target='_blank'
                    rel='noreferrer'
                  >
                    Open saved file
                  </a>
                </div>
              ) : null}
            </div>
          ) : null}
        </form>
      </div>
    </section>
  );
};
export default HostCreateRoom;
