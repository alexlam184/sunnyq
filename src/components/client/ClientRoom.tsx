'use client';
import { CHOICE, QuestionType } from '@/src/lib/type';
import { useRoomStore } from '@/store/RoomStore';

export default function ClientIdle() {
  const { getHost, getUsers, getQuestion, username } = useRoomStore();
  console.log(getQuestion());
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-4xl font-bold mb-8'>ClientRoom</h1>
      <h1 className='text-2xl font-bold mb-8'>{'Name: ' + username}</h1>
      <div className='text-4xl font-bold mb-8'>
        {'Teacher: ' + getHost().username}
      </div>
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
