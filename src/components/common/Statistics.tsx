import { CHOICE, Room, User } from '@/src/lib/type';
import { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

/**
 * Define the properties for Statistics.
 */
interface StatisticsProps {
  room: Room;
}

/**
 * Define the colors for each choice.
 */
const COLORS = [
  '#0088FE', // Blue
  '#00C49F', // Green
  '#FFBB28', // Orange
  '#FF8042', // Red
];

const Statistics: React.FC<StatisticsProps> = ({ room }) => {
  const { num_of_answered, question, users } = room;
  /**
   * Calculate the accuracy of the question's answers
   */
  const accuracy = useMemo(() => {
    const totalUsers = num_of_answered;
    if (totalUsers === 0) return 0;

    const correctAnswers = users.filter(
      (user) => user.answer === question.answer
    ).length;

    return (correctAnswers / totalUsers) * 100;
  }, [room]);

  /**
   * Get the counts of each choice
   */
  const data = useMemo(() => {
    const counts: { [key in CHOICE]: number } = { A: 0, B: 0, C: 0, D: 0 };

    users.forEach((user) => {
      user.answer && counts[user.answer as CHOICE]++;
    });

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [room]);

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
};

export default Statistics;
