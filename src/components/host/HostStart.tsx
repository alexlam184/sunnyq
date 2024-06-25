import { CHOICE, QuestionType } from '@/src/lib/type';
import { useRoomStore } from '@/store/RoomStore';

export default function HostStart() {
  const { getRoomCode, getUsers, getHost, getQuestion } = useRoomStore();

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-4xl font-bold mb-8'>Join the Room</h1>
      <p className='text-2xl mb-4'>
        Code:
        <span className='text-2xl font-bold ml-2'>{getRoomCode()}</span>
      </p>
      <div className='space-x-4'>
        <div className='text-4xl font-bold mb-8'>
          {'Question: ' + getQuestion().question}
        </div>
        <div className='text-4xl font-bold mb-8'>
          {'Remark: ' + getQuestion().remark}
        </div>
        <div>
          {getQuestion().type === QuestionType.MultipleChoice
            ? getQuestion().choices?.map((choice) => (
                <div key={choice.value} className='text-4xl font-bold mb-8'>
                  {choice.value + ': ' + choice.content}
                </div>
              ))
            : ''}
        </div>
        <button
          className='bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded'
          onClick={() => {}}
        >
          Stop Answering
        </button>
        <button
          className='bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded'
          onClick={() => {}}
        >
          Delete Game
        </button>
      </div>
      <div className='text-4xl font-bold mb-8'>
        {'Teacher: ' + getHost().username}
      </div>
      <div>
        <h2 className='text-4xl font-bold mb-8'>Joined Players</h2>
        {getUsers().length > 0 ? (
          <ul>
            {getUsers().map((user, index) => (
              <li className='text-4xl' key={index}>
                {index + 1 + '. '}
                {user.username}
              </li>
            ))}
          </ul>
        ) : (
          <p>No users yet!</p>
        )}
      </div>
    </div>
  );
}
