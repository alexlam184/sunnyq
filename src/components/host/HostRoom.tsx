import { CHOICE, QUESTION } from '@/src/lib/type';
import { useRoomStore } from '@/store/RoomStore';
import Button from '../ui/Button';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useCallback, useMemo, useState } from 'react';
import Tabs from '../ui/Tabs';
import { TabOption } from '../ui/Tabs';

/**
 * Define the Tab options
 */
enum TABS {
  Answers = 'Answers',
  Statistics = 'Statistics',
}

export default function HostRoom() {
  const { getRoomCode, getUsers, getHost, getQuestion, room } = useRoomStore();

  /**
   * Get the counts of each choice
   */
  const data = useMemo(() => {
    const counts: { [key in CHOICE]: number } = { A: 0, B: 0, C: 0, D: 0 };

    getUsers().forEach((user) => {
      user.answer && counts[user.answer as CHOICE]++;
    });

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [room]);

  /**
   * Calculate the accuracy of the question's answers
   */
  const accuracy = useMemo(() => {
    const totalUsers = room.num_of_answered;
    if (totalUsers === 0) return 0;

    const correctAnswers = getUsers().filter(
      (user) => user.answer === getQuestion().answer
    ).length;

    return (correctAnswers / totalUsers) * 100;
  }, [room]);

  /**
   * Define the colors for each choice.
   */
  const COLORS = useMemo(
    () => [
      '#0088FE', // Blue
      '#00C49F', // Green
      '#FFBB28', // Orange
      '#FF8042', // Red
    ],
    []
  );

  /**
   * Define the tabs option
   */
  const [tab, setTab] = useState<TABS>(TABS.Answers);
  const options: TabOption[] = useMemo(() => {
    return [
      { value: TABS.Answers, label: TABS.Answers },
      { value: TABS.Statistics, label: TABS.Statistics },
    ];
  }, []);

  /**
   * The Component of the Answers Tab
   */
  const Answers = useCallback(() => {
    const answeredUsers = getUsers().filter((user) => user.answer != null);

    return (
      <div className='scroll-container overflow-y-auto h-[80vh] p-4 bg-white shadow-md rounded-lg border border-gray-300'>
        {room.num_of_answered > 0 ? (
          <ul className='space-y-4'>
            {answeredUsers.map((user, index) => (
              <li
                className='flex flex-col space-y-1 p-4 border border-gray-200 bg-gray-50 hover:bg-gray-100 rounded-lg transition'
                key={index}
              >
                <span className='font-semibold text-lg text-gray-800'>
                  {index + 1}. {user.username}
                </span>
                <span className='text-md text-gray-600'>{user.answer}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className='text-lg text-gray-600'>No answer yet!</p>
        )}
      </div>
    );
  }, [room.users]);

  /**
   * The Component of the Statistics Tab
   */
  const Statistics = useCallback(() => {
    return (
      <div className='scroll-container overflow-y-auto h-[80vh] p-4 bg-gray-100 shadow-md rounded-lg border border-gray-300'>
        <div>
          <h2 className='text-2xl font-bold mb-4 text-left text-gray-700'>
            Accuracy: {accuracy.toFixed(1)}%
          </h2>
        </div>
        <div>
          <h2 className='text-2xl font-bold mb-4 text-center text-gray-700 underline'>
            Bar Chart
          </h2>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey='value' fill='#8884d8' name='count'>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h2 className='text-2xl font-bold mb-4 text-center text-gray-700 underline'>
            Pie Chart
          </h2>
          <ResponsiveContainer width='100%' height={300}>
            <PieChart>
              <Pie
                data={data}
                cx='50%'
                cy='50%'
                labelLine={false}
                outerRadius={80}
                fill='#8884d8'
                dataKey='value'
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }, [data]);

  return (
    <div className='flex min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 text-gray-800 p-8 flex-col md:flex-row'>
      <div className='w-full md:w-80 flex flex-col order-2 md:order-1'>
        {/* Info Field */}
        <div className='bg-white rounded-lg shadow-lg p-6 mb-8 flex-none'>
          <h2 className='text-2xl font-bold mb-4 text-black'>
            Teacher:{' '}
            <span className='font-semibold text-black'>
              {getHost().username}
            </span>
          </h2>
          <p className='text-xl mb-2'>
            Code:{' '}
            <span className='font-extrabold text-blue-700 text-3xl'>
              {getRoomCode()}
            </span>
          </p>
        </div>

        {/* Player List Field */}
        <div className='bg-white rounded-lg shadow-lg p-6 flex-grow'>
          <div className='w-full flex justify-between items-center mb-4'>
            <h2 className='text-2xl font-bold text-blue-600'>Joined Players</h2>
            <span className='font-bold text-2xl px-2 bg-blue-100 text-blue-700 rounded-lg'>
              {room.num_of_answered}/{room.num_of_students}
            </span>
          </div>
          <div className='scroll-container overflow-y-auto max-h-[65vh] border-t border-gray-200'>
            {getUsers().length > 0 ? (
              <ul className='space-y-2 mt-4'>
                {getUsers().map((user, index) => (
                  <div className='flex justify-between items-center mr-5'>
                    <li className='text-lg flex items-center' key={index}>
                      <span className='mr-2 text-gray-500'>{index + 1}.</span>
                      <span className='flex-grow'>{user.username}</span>
                    </li>
                    <div
                      className={
                        user.answer
                          ? `bg-green-500 rounded-full w-5 h-5`
                          : `bg-red-500 rounded-full w-5 h-5`
                      }
                    ></div>
                  </div>
                ))}
              </ul>
            ) : (
              <p className='text-lg text-gray-600 mt-4'>No users yet!</p>
            )}
          </div>
        </div>
      </div>

      {/* Question Answer Field */}
      <div className='flex-grow max-w-3xl bg-white rounded-lg shadow-lg p-8 md:ml-8 order-1 md:order-2 mb-8 md:mb-0'>
        <h1 className='text-4xl font-bold mb-6 text-center text-blue-600'>
          Host Dashboard
        </h1>

        <div className='bg-gray-100 p-6 rounded-lg flex-grow'>
          {/* Question and Remarks */}
          <h2 className='text-2xl font-bold mb-4 text-blue-600'>Question</h2>
          <p className='text-xl mb-2'>{getQuestion().question}</p>
          <p className='text-sm text-gray-500 mb-4'>{getQuestion().remark}</p>

          {/* Answer Field */}
          {getQuestion().type === QUESTION.MultipleChoice && (
            <div className='space-y-4'>
              {getQuestion().choices?.map((choice) => (
                <div key={choice.value} className='flex items-center text-lg'>
                  <span className='font-semibold mr-2'>{choice.value}:</span>
                  <span>{choice.content}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className='flex justify-center space-x-4 mt-8'>
          <Button
            buttonText='Stop Answering'
            onClick={() => {}}
            buttonType='base'
            themeColor='blue'
          />
          <Button
            buttonText='Delete Game'
            onClick={() => {}}
            buttonType='border'
            themeColor='blue'
          />
        </div>
      </div>

      {/* Tabs Field */}
      <div className='flex-grow max-w-3xl bg-white rounded-lg shadow-lg p-8 md:ml-8 order-1 md:order-2 mb-8 md:mb-0 space-y-4'>
        <Tabs
          options={options}
          onChange={(option: TabOption) => {
            setTab(option.value);
          }}
          defaultValue={tab}
        />
        {tab === TABS.Answers ? <Answers /> : <Statistics />}
      </div>
    </div>
  );
}