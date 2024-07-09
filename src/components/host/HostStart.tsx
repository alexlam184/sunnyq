import { QUESTION } from '@/src/lib/type';
import { useRoomStore } from '@/store/RoomStore';
import Button from '../ui/Button';

export default function HostStart() {
  const { getRoomCode, getUsers, getHost, getQuestion } = useRoomStore();

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
          <h2 className='text-2xl font-bold mb-4 text-blue-600'>
            Joined Players
          </h2>
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
          <p className='text-lg text-gray-600 mb-4'>{getQuestion().remark}</p>

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

      <div className='flex-grow max-w-3xl bg-white rounded-lg shadow-lg p-8 md:ml-8 order-1 md:order-2 mb-8 md:mb-0'>
        <h1 className='text-4xl font-bold mb-6 text-center text-blue-600'>
          Statistics
        </h1>
      </div>
    </div>
  );
}
