import { BaseQuestion, CHOICE, QUESTION, User } from '@/src/lib/type';
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
 * Define the colors for each choice.
 */
const COLORS = [
  '#0088FE', // Blue
  '#00C49F', // Green
  '#FFBB28', // Orange
  '#FF8042', // Red
];

const Statistics = ({
  num_of_answered,
  question,
  users,
  currentQuestionIndex,
}: {
  num_of_answered: number;
  question: BaseQuestion;
  users: User[];
  currentQuestionIndex: number;
}) => {
  /**
   * Calculate the accuracy of the question's answers
   */
  const accuracy = useMemo(() => {
    const totalUsers = num_of_answered;
    if (totalUsers === 0) return 0;

    const correctAnswers = users.filter(
      (user) =>
        user.answers && user.answers[currentQuestionIndex] === question.answer
    ).length;

    return (correctAnswers / totalUsers) * 100;
  }, [num_of_answered, question.answer, users, currentQuestionIndex]);

  /**
   * Get the counts of each choice
   */
  const data = useMemo(() => {
    switch (question.type) {
      case QUESTION.MultipleChoice:
        const counts: { [key in CHOICE]: number } = { A: 0, B: 0, C: 0, D: 0 };
        users.forEach((user) => {
          user.answers &&
            user.answers[currentQuestionIndex] &&
            counts[user.answers[currentQuestionIndex] as CHOICE]++;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
      case QUESTION.TextInput:
        const correctCounts = { correct: 0, incorrect: 0 };
        users.forEach((user) => {
          user.answers && user.answers[currentQuestionIndex] === question.answer
            ? correctCounts.correct++
            : correctCounts.incorrect++;
        });
        return Object.entries(correctCounts).map(([name, value]) => ({
          name,
          value,
        }));
      default:
        return [];
    }
  }, [users, question.answer, question.type, currentQuestionIndex]);

  return (
    <div className='scroll-container overflow-y-auto max-h-[95vh] p-4 bg-gray-100 shadow-md rounded-lg border border-gray-300'>
      <div>
        <h2 className='text-xl font-bold mb-4 text-left text-gray-700'>
          Accuracy: {accuracy.toFixed(1)}%
        </h2>
      </div>
      <div>
        <h2 className='text-xl font-bold mb-4 text-center text-gray-700 underline'>
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
        <h2 className='text-xl font-bold mb-4 text-center text-gray-700 underline'>
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
