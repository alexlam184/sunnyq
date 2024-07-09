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
import { useMemo } from 'react';

export default function HostRoom() {
  const { getRoomCode, getUsers, getHost, getQuestion, room } = useRoomStore();

  const data = useMemo(() => {
    const counts = { A: 0, B: 0, C: 0, D: 0 };
    getUsers().forEach((user) => {
      console.log(user.answer);
      user.answer && counts[user.answer as CHOICE]++;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [room]);

  const accuracy = useMemo(() => {
    const totalUsers = room.num_of_students;
    if (totalUsers === 0) return 0;

    const correctAnswers = getUsers().filter(
      (user) => user.answer === getQuestion().answer
    ).length;

    return (correctAnswers / totalUsers) * 100;
  }, [room]);

  const COLORS = useMemo(
    () => ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'],
    []
  );

  return (
    <div className='flex min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 text-gray-800 p-8 flex-col md:flex-row'>
      <div className='w-full md:w-80 flex flex-col order-2 md:order-1'>
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

        <div className='bg-white rounded-lg shadow-lg p-6 flex-grow'>
          <div className=' w-full flex justify-between'>
            <h2 className='text-2xl font-bold mb-4 text-blue-600'>
              Joined Players
            </h2>
            <span className=' font-bold text-2xl px-1'>
              {room.num_of_answered + '/' + room.num_of_students}
            </span>
          </div>

          {getUsers().length > 0 ? (
            <ul className='space-y-2'>
              {getUsers().map((user, index) => (
                <li className='text-lg' key={index}>
                  {index + 1}. {user.username}
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-lg text-gray-600'>No users yet!</p>
          )}
        </div>
      </div>

      <div className='flex-grow max-w-3xl bg-white rounded-lg shadow-lg p-8 md:ml-8 order-1 md:order-2 mb-8 md:mb-0'>
        <h1 className='text-4xl font-bold mb-6 text-center text-blue-600'>
          Host Dashboard
        </h1>

        <div className='bg-gray-100 p-6 rounded-lg flex-grow'>
          <h2 className='text-2xl font-bold mb-4 text-blue-600'>Question</h2>
          <p className='text-xl mb-2'>{getQuestion().question}</p>
          <p className='text-sm text-gray-500 mb-4'>{getQuestion().remark}</p>

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

      <div className='flex-grow max-w-3xl bg-white rounded-lg shadow-lg p-8 md:ml-8 order-1 md:order-2 mb-8 md:mb-0 space-y-4'>
        <h1 className='text-4xl font-bold mb-6 text-center text-blue-600'>
          Statistics
        </h1>
        <div>
          <h2 className='text-2xl font-bold mb-4 text-center text-gray-700'>
            Accuracy: {accuracy}%
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
    </div>
  );
}
