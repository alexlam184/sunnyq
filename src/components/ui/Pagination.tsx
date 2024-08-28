import { maxHeaderSize } from 'http';
import React from 'react';

interface PaginationProps {
  totalPages: number;
  currentIndex: number;
  onPageChange: (page: number) => void;
  type?: 'submit' | undefined;
  themeColor?: 'blue' | 'green' | 'red';
  maxVisiblePages?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentIndex,
  onPageChange,
  type,
  themeColor = 'blue',
  maxVisiblePages = 5,
}) => {
  const renderPageNumbers = () => {
    const pageNumbers = [];

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(renderPageButton(i));
      }
    } else {
      const leftSide = Math.floor(maxVisiblePages / 2);
      const rightSide = maxVisiblePages - leftSide - 1;

      if (currentIndex + 1 > totalPages - rightSide) {
        for (let i = totalPages - maxVisiblePages + 1; i <= totalPages; i++) {
          pageNumbers.push(renderPageButton(i));
        }
      } else if (currentIndex + 1 < leftSide + 1) {
        for (let i = 1; i <= maxVisiblePages; i++) {
          pageNumbers.push(renderPageButton(i));
        }
      } else {
        pageNumbers.push(renderPageButton(1));
        if (currentIndex > leftSide + 1) {
          pageNumbers.push(<li key='ellipsis-left'>...</li>);
        }

        for (
          let i = currentIndex - leftSide + 2;
          i <= currentIndex + rightSide;
          i++
        ) {
          pageNumbers.push(renderPageButton(i));
        }

        if (currentIndex + rightSide < totalPages - 1) {
          pageNumbers.push(<li key='ellipsis-right'>...</li>);
        }
        pageNumbers.push(renderPageButton(totalPages));
      }
    }

    return pageNumbers;
  };
  const colorVariant = {
    blue: 'border-blue-600 bg-blue-600',
    green: 'border-green-600 bg-green-600',
    red: 'border-red-600 bg-red-600',
  };
  const renderPageButton = (page: number) => (
    <li key={page}>
      {page === currentIndex + 1 ? (
        <span
          className={`${colorVariant[themeColor]} block size-8 rounded text-center leading-8 text-white`}
        >
          {page}
        </span>
      ) : (
        <button
          type={type}
          onClick={() => onPageChange(page - 1)}
          className='block size-8 rounded border border-gray-100 bg-white text-center leading-8 text-gray-900'
        >
          {page}
        </button>
      )}
    </li>
  );

  return (
    <ol className='flex justify-center gap-1 text-xs font-medium'>
      <li>
        <button
          type={type}
          onClick={() =>
            onPageChange(currentIndex > 0 ? currentIndex - 1 : currentIndex)
          }
          className='inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180 disabled:text-gray-300'
          aria-label='Prev Page'
          disabled={currentIndex === 0}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='size-3'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path
              fillRule='evenodd'
              d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
              clipRule='evenodd'
            />
          </svg>
        </button>
      </li>

      {renderPageNumbers()}

      <li>
        <button
          type={type}
          onClick={() =>
            onPageChange(
              currentIndex < totalPages - 1 ? currentIndex + 1 : currentIndex
            )
          }
          className='inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180 disabled:text-gray-300'
          aria-label='Next Page'
          disabled={currentIndex === totalPages - 1}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='size-3'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path
              fillRule='evenodd'
              d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
              clipRule='evenodd'
            />
          </svg>
        </button>
      </li>
    </ol>
  );
};

export default Pagination;
