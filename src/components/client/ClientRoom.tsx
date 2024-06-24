'use client';

import { useRoomStore } from '@/store/RoomStore';

export default function ClientIdle() {
  const { getHost, getUsers, getQuestion, username } = useRoomStore();
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
      {getQuestion().choices.map((choice) => (
        <div className='text-4xl font-bold mb-8'>
          {String.fromCharCode(65 + choice.value) + ': ' + choice.content}
        </div>
      ))}

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
