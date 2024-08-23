import React, { ReactNode } from 'react';

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  deleteAction: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  deleteAction,
}) => {
  return (
    <div className='space-y-4 w-full'>
      <details className='group [&_summary::-webkit-details-marker]:hidden'>
        <summary className='flex cursor-pointer items-center justify-between gap-1.5 rounded-lg bg-gray-50 p-4 text-gray-900'>
          <div className='flex space-x-2'>
            <svg
              className='size-5 shrink-0 transition duration-300 group-open:-rotate-180'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M19 9l-7 7-7-7'
              />
            </svg>
            <p className='font-medium truncate max-w-md'>{title}</p>
          </div>
          <button onClick={deleteAction}>
            <svg
              className='lg:invisible size-5 shrink-0 lg:opacity-0 lg:duration-300 group-hover:opacity-100 group-hover:rotate-90 group-hover:visible lg:transition-all hover:stroke-red-600 hover:scale-120'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </summary>

        <div className='mt-4 px-4 leading-relaxed text-gray-700'>
          {children}
        </div>
      </details>
    </div>
  );
};

export default CollapsibleSection;
