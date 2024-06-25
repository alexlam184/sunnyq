import React, { ChangeEventHandler } from 'react';

interface TextAreaProps {
  title: string;
  rows: number;
  onChange: ChangeEventHandler<HTMLTextAreaElement> | undefined;
  defaultValue?: string | '';
}

const TextAreaField: React.FC<TextAreaProps> = ({
  title,
  rows,
  onChange,
  defaultValue: value,
}) => {
  return (
    <label className='relative block overflow-hidden rounded-md border border-gray-200 px-3 pt-3 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600'>
      <textarea
        id={title}
        placeholder={title}
        rows={rows}
        className='peer w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm text-black pt-6'
        onChange={onChange}
        defaultValue={value}
      ></textarea>
      <span className='absolute left-3 top-2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/8 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs'>
        {title}
      </span>
    </label>
  );
};

export default TextAreaField;
