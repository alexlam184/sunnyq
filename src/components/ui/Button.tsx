import React, { ButtonHTMLAttributes } from 'react';

export default function Button(props: {
  name: string;
  onclick?: () => void;
  type?: 'button' | 'submit' | 'reset' | undefined;
}) {
  return (
    <button
      className='p-[3px] relative'
      onClick={props.onclick}
      type={props.type ?? 'button'}
    >
      <div className='absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg' />
      <div className='px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent'>
        {props.name}
      </div>
    </button>
  );
}
